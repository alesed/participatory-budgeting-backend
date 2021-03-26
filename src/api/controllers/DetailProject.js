const pool = require("../../config/db");
const utils = require("../helpers/Utils");

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
};
