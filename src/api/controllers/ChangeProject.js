const pool = require("../../config/db");

const crypto = require("crypto");

module.exports = {
  /**
   * Update project with temporary project that has project_id reference or return error success
   * @param {{hash: string, projectId: number}} projectInput
   * @returns {success}
   */
  updatePendingProjectChange: async (req, res) => {
    try {
      const projectInput = req.body;

      let projectToUpdate = await pool.query(
        "SELECT * FROM Project WHERE project_id = $1",
        [projectInput.projectId]
      );
      projectToUpdate = projectToUpdate.rows[0];

      const checkResult = await _checkHashWithExistingProject(
        projectInput.hash,
        projectToUpdate
      );

      if (checkResult === false) return res.send({ success: false });

      let temporaryProject = await pool.query(
        "SELECT * FROM Project WHERE project_id = $1",
        [projectInput.projectId + 1000000]
      );
      temporaryProject = temporaryProject.rows[0];

      const updateResult = await _updateOldProjectWithTemporaryProject(
        projectToUpdate,
        temporaryProject
      );

      if (updateResult === false) return res.send({ success: false });

      const deleteResult = await _deleteTemporaryProject(temporaryProject);

      if (deleteResult === false) return res.send({ success: false });

      return res.send({ success: true });
    } catch (err) {
      console.error(err);
      return res.send({ success: false });
    }
  },
};

/**
 * Check if passed hash is equal with hash created from existing project id and subject name
 * @param {string} hash
 * @param {ProjectModel} existingProject
 * @returns {success}
 */
async function _checkHashWithExistingProject(hash, existingProject) {
  try {
    const subject = await pool.query(
      "SELECT subject_name FROM Subject WHERE subject_id = $1",
      [existingProject.subject_id]
    );

    if (!subject.rowCount > 0) return false;
    const subjectName = subject.rows[0].subject_name;

    const projectHash = crypto
      .createHash("sha1")
      .update(subjectName + existingProject.project_id)
      .digest("hex");

    if (hash !== projectHash) return false;

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * Update columns of old project with new project
 * @param {ProjectModel} oldProject
 * @param {ProjectModel} newProject
 * @returns {success}
 */
async function _updateOldProjectWithTemporaryProject(oldProject, newProject) {
  try {
    // fetch new expenses
    const newProjectExpensesResult = await pool.query(
      "SELECT * FROM Project_Expenses WHERE project_id = $1",
      [newProject.project_id]
    );

    const newProjectExpenses = newProjectExpensesResult.rows;

    // delete old expenses
    await pool.query("DELETE FROM Project_Expenses WHERE project_id = $1", [
      oldProject.project_id,
    ]);

    // add new expenses (temporary)
    await newProjectExpenses.forEach(async (element) => {
      await pool.query(
        "INSERT INTO Project_Expenses(expense_name, expense_cost, project_id) VALUES($1, $2, $3)",
        [element.expense_name, element.expense_cost, oldProject.project_id]
      );
    });

    // update old project with temporary values
    await pool.query(
      "UPDATE Project " +
        "SET " +
        "project_name = $1, " +
        "author = $2, " +
        "description = $3 " +
        "WHERE project_id = $4",
      [
        newProject.project_name,
        newProject.author,
        newProject.description,
        oldProject.project_id,
      ]
    );

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * Delete expenses and then project (temporary)
 * @param {ProjectModel} temporaryProject
 * @returns {success}
 */
async function _deleteTemporaryProject(temporaryProject) {
  try {
    // expenses
    await pool.query("DELETE FROM Project_Expenses WHERE project_id = $1", [
      temporaryProject.project_id,
    ]);
    // project
    await pool.query("DELETE FROM Project WHERE project_id = $1", [
      temporaryProject.project_id,
    ]);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
