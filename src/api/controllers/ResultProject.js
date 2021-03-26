const pool = require("../../config/db");
const utils = require("../helpers/Utils");

module.exports = {
  /**
   * Get all projects of subject (result page)
   * @param {string} subjectName
   * @returns {projects JSON}
   */
  getAllResultProjects: async (req, res) => {
    try {
      const subjectName = req.body.subjectName;
      let category = req.body.category;
      if (category != undefined) category = category.split(",");

      let projects;
      const currentYear = utils.getCurrentYear();
      if (category.length > 0 && category[0] != "") {
        projects = await pool.query(
          "SELECT project_id, project_name, category, COUNT(*) as number_of_votes " +
            "FROM Project " +
            "INNER JOIN Subject USING (subject_id) " +
            "INNER JOIN Vote USING (project_id) " +
            "WHERE subject_name = $1 AND category = ANY ($2) " +
            "AND EXTRACT(year FROM date_created) = $3 " +
            "GROUP BY project_id",
          [subjectName, category, currentYear]
        );
      } else {
        projects = await pool.query(
          "SELECT project_id, project_name, category, COUNT(*) as number_of_votes " +
            "FROM Project " +
            "INNER JOIN Subject USING (subject_id) " +
            "INNER JOIN Vote USING (project_id) " +
            "WHERE subject_name = $1 " +
            "AND EXTRACT(year FROM date_created) = $2 " +
            "GROUP BY project_id",
          [subjectName, currentYear]
        );
      }

      res.json(projects.rows);
    } catch (err) {
      console.error(err.message);
    }
  },
};
