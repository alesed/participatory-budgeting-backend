const pool = require("../../config/db");

module.exports = {
  /**
   * Checks if desired subject exists in DB
   * @param {string} subjectName
   * @returns {isExisting boolean}
   */
  isSubjectExisting: async (req, res) => {
    try {
      const { subjectName } = req.params;
      const subject = await pool.query(
        "SELECT * FROM Subject WHERE subject_name = $1",
        [subjectName]
      );

      if (subject.rowCount > 0) res.json(true);
      else res.json(false);
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * Get all sujects
   * @returns {subjects JSON}
   */
  getAllSubjects: async (_, res) => {
    try {
      const subjects = await pool.query("SELECT * FROM Subject");

      res.json(subjects.rows);
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * Get one specific subject
   * @param {string} subjectName
   * @returns {subject JSON}
   */
  getOneSubject: async (req, res) => {
    try {
      const { subjectName } = req.params;
      const subject = await pool.query(
        "SELECT * FROM Subject WHERE subject_name = $1",
        [subjectName]
      );

      if (subject.rowCount > 0) res.json(subject.rows[0]);
      else res.json(null);
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * Return subject ID
   * @param {string} subjectName
   * @returns {number}
   */
  getSubjectId: async (subjectName) => {
    try {
      const subject = await pool.query(
        "SELECT subject_id FROM Subject WHERE subject_name = $1",
        [subjectName]
      );

      return subject.rows[0].subject_id;
    } catch (err) {
      console.error(err.message);
    }
  },
};
