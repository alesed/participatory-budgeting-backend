const pool = require("../../config/db");
const utils = require("../helpers/Utils");
const subjectController = require("../controllers/Subject");
const crypto = require("crypto");

module.exports = {
  /**
   * Get one specific project
   * @param {number} projectId
   * @returns {project JSON}
   */
  getProjectDetail: async (req, res) => {
    try {
      const { projectId } = req.params;
      let subject = await pool.query(
        "SELECT project_id, project_name, author, author_email, date_created, category, description, geo_latitude, geo_longtitude, decision, decision_text " +
          "FROM Project " +
          "WHERE project_id = $1",
        [parseInt(projectId)]
      );
      if (subject.rowCount > 0) {
        subject = utils.convertProjectDecisionData(subject);
        res.json(subject.rows[0]);
      } else res.json(null);
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * Get photo of selected project
   * @param {number} projectId
   * @returns {project_photo JSON}
   */
  getProjectPhoto: async (req, res) => {
    try {
      const { projectId } = req.params;
      const subject = await pool.query(
        "SELECT photo_name, photo_path FROM Project_Photo WHERE project_id = $1",
        [parseInt(projectId)]
      );
      if (subject.rowCount > 0) res.json(subject.rows);
      else res.json(null);
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * Get all expenses of selected project
   * @param {number} projectId
   * @returns {project_expenses JSON}
   */
  getProjectExpenses: async (req, res) => {
    try {
      const { projectId } = req.params;
      const subject = await pool.query(
        "SELECT expense_name, expense_cost FROM Project_Expenses WHERE project_id = $1",
        [parseInt(projectId)]
      );
      if (subject.rowCount > 0) res.json(subject.rows);
      else res.json(null);
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * Update decision of project in DB
   * @returns {success}
   */
  updateDecisionOfProject: async (req, res) => {
    try {
      const decisionData = req.body;

      await pool.query(
        "UPDATE Project " +
          "SET decision = $1::bit, decision_text = $2 " +
          "WHERE project_id = $3",
        [
          decisionData.decision ? 1 : 0,
          decisionData.decisionText,
          decisionData.projectId,
        ]
      );

      return res.send({ success: true });
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * Send email with reference to new project
   * @returns {success}
   */
  doChangeRequest: async (req, res) => {
    try {
      const projectInput = req.body;

      const subjectName = projectInput.subjectName;
      const projectData = projectInput.projectData;
      const projectExpenses = projectInput.projectExpenses;

      const projectHash = crypto
        .createHash("sha1")
        .update(subjectName + projectData.project_id)
        .digest("hex");

      const acceptationURL =
        req.protocol +
        "://" +
        req.get("host") +
        "/change-project/" +
        projectHash +
        "/" +
        projectData.project_id;

      const result = await _createTemporaryProject(
        subjectName,
        projectData,
        projectExpenses
      );

      if (result === true) {
        // send EMAIL TODO:
        return res.send({ success: true });
      }
      return res.send({ success: false });
    } catch (err) {
      return res.send({ success: false });
    }
  },
};

/**
 * Create temporary project which is a reference to real project
 */
async function _createTemporaryProject(
  subjectName,
  projectData,
  projectExpenses
) {
  let result;
  try {
    await subjectController
      .getSubjectId(subjectName)
      .then(async (value) => {
        subjectId = value;
        createdProject = await pool.query(
          "INSERT INTO Project(project_id, project_name, author, author_email, date_created, category, description, geo_latitude, geo_longtitude, subject_id) " +
            "VALUES($1, $2, $3, $4, NOW(), $5, $6, $7, $8, $9) " +
            "RETURNING project_id",
          [
            projectData.project_id + 1000000,
            projectData.project_name + "_temp",
            projectData.author,
            projectData.author_email,
            projectData.category,
            projectData.description,
            projectData.geo_latitude,
            projectData.geo_longtitude,
            subjectId,
          ]
        );

        projectExpenses.forEach(async (element) => {
          await pool.query(
            "INSERT INTO Project_Expenses(expense_name, expense_cost, project_id) " +
              "VALUES($1, $2, $3)",
            [
              element.expense_name,
              element.expense_cost,
              createdProject.rows[0].project_id,
            ]
          );
        });

        result = true;
      })
      .catch(() => {
        result = false;
        return;
      });
  } catch (err) {
    return result;
  }
  return result;
}
