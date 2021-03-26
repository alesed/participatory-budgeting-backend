const pool = require("../../config/db");

const subjectController = require("../controllers/Subject");

module.exports = {
  /**
   * Save new project of subject to DB
   * @returns {response JSON}
   */
  saveNewProject: async (req, res) => {
    try {
      const newProjectData = req.body;
      let subjectId;
      let createdProject;

      subjectController
        .getSubjectId(newProjectData.subjectName)
        .then(async (value) => {
          subjectId = value;

          createdProject = await pool.query(
            "INSERT INTO Project(project_name, author, author_email, date_created, category, description, geo_latitude, geo_longtitude, subject_id) " +
              "VALUES($1, $2, $3, NOW(), $4, $5, $6, $7, $8) " +
              "RETURNING project_id",
            [
              newProjectData.projectName,
              newProjectData.author,
              newProjectData.authorEmail,
              newProjectData.category,
              newProjectData.description,
              newProjectData.mapMarker.lat,
              newProjectData.mapMarker.lng,
              subjectId,
            ]
          );

          const newProjectId = createdProject.rows[0].project_id;
          await _saveProjectPhoto(newProjectId, newProjectData.photo);
          await _saveProjectExpenses(newProjectId, newProjectData.expenses);

          return res.send({ success: true });
        });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send({ success: false });
    }
  },
};

/**
 * After saving project, save photo to firebase storage
 * @param {ProposalPhoto} photo
 * @returns {HTTP response}
 */
function _saveProjectPhoto(projectId, photo) {
  pool.query(
    "INSERT INTO Project_Photo(photo_name, photo_path, project_id) " +
      "VALUES($1, $2, $3)",
    [photo.photoName, photo.photoFirebasePath, projectId]
  );
}

/**
 * After saving project, save all included expenses one by one
 * @param {ProposalExpenses[]} expenses
 * @returns {HTTP response}
 */
function _saveProjectExpenses(projectId, expenses) {
  expenses.forEach((element) => {
    pool.query(
      "INSERT INTO Project_Expenses(expense_name, expense_cost, project_id) " +
        "VALUES($1, $2, $3)",
      [element.name, element.cost, projectId]
    );
  });
}
