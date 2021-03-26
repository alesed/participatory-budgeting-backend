const pool = require("../../config/db");
const utils = require("../helpers/Utils");

module.exports = {
  /**
   * Retrieve description of subject visible on home page
   * @param {string} subjectName
   * @returns {description JSON}
   */
  getHomeDescription: async (req, res) => {
    try {
      const { subjectName } = req.params;
      const description = await pool.query(
        "SELECT description FROM Subject WHERE subject_name = $1",
        [subjectName]
      );

      if (description.rowCount > 0) res.json(description.rows[0]);
      else res.json(null);
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * Retrieve schedule of subject visible on home page
   * @param {string} subjectName
   * @returns {schedule JSON}
   */
  getHomeSchedule: async (req, res) => {
    try {
      const { subjectName } = req.params;
      let schedule = await pool.query(
        "SELECT schedule_name, date_from, date_to " +
          "FROM Subject_Schedule " +
          "INNER JOIN Subject USING (subject_id) " +
          "WHERE subject_name = $1 " +
          "ORDER BY date_from ASC",
        [subjectName]
      );

      if (schedule.rowCount > 0) {
        schedule = utils.convertToDate(schedule);
        res.json(schedule.rows);
      } else res.json(null);
    } catch (err) {
      console.error(err.message);
    }
  },
};
