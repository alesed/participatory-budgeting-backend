const pool = require("../../config/db");
const utils = require("../helpers/Utils");

module.exports = {
  /**
   * Retrieve schedule of one specific subject
   * @param {string} subjectName
   * @returns {scheduleData JSON}
   */
  getScheduleOfSubject: async (req, res) => {
    try {
      const { subjectName } = req.params;
      let subject = await pool.query(
        "SELECT schedule_name, date_from, date_to, Subject_Schedule.description " +
          "FROM Subject_Schedule " +
          "INNER JOIN Subject USING (subject_id) " +
          "WHERE subject_name = $1 " +
          "ORDER BY date_from ASC",
        [subjectName]
      );

      if (subject.rowCount > 0) {
        subject = utils.convertToDate(subject);
        res.json(subject.rows);
      } else res.json(null);
    } catch (err) {
      console.error(err.message);
    }
  },
};
