const pool = require("../../../config/db");
const utils = require("../../helpers/Utils");

module.exports = {
  /**
   * Retrieve projects in admin decision page from DB
   * @param {string} subjectName
   * @returns {description JSON}
   */
  getDecisionProjects: async (req, res) => {
    try {
      const { subjectName } = req.params;
      const currentYear = utils.getCurrentYear();

      let decisionProjects = await pool.query(
        "SELECT project_id, project_name, decision " +
          "FROM Project " +
          "INNER JOIN Subject USING(subject_id) " +
          "WHERE subject_name = $1 " +
          "AND EXTRACT(year FROM date_created) = $2  AND project_id < 1000000",
        [subjectName, currentYear]
      );
      if (decisionProjects.rowCount > 0) {
        decisionProjects = utils.convertProjectDecisionData(decisionProjects);
        res.json(decisionProjects.rows);
      } else res.json(null);
    } catch (err) {
      console.error(err.message);
    }
  },
};
