const pool = require("../../../config/db");
const utils = require("../../helpers/Utils");

const subjectController = require("../../controllers/Subject");

module.exports = {
  /**
   * Retrieve all schedules of one subject from DB to admin page! (change schedule)
   * @returns {ChangeScheduleData}
   */
  getAllSchedules: async (req, res) => {
    try {
      const { subjectName } = req.params;
      let schedules = await pool.query(
        "SELECT schedule_id, schedule_name, date_from, date_to, Subject_Schedule.description " +
          "FROM Subject_Schedule " +
          "INNER JOIN Subject USING(subject_id) " +
          "WHERE subject_name = $1 " +
          "ORDER BY date_from ASC",
        [subjectName]
      );

      if (schedules.rowCount > 0) {
        schedules = utils.convertToDate(schedules);
        res.json(schedules.rows);
      } else res.json(null);
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * Update Subject schedule and returns success/error response
   * @returns {ChangeScheduleResponse}
   */
  updateSchedule: async (req, res) => {
    try {
      let updateData = req.body;
      updateData.date_from = utils.convertDateToDBDate(updateData.date_from);
      updateData.date_to = utils.convertDateToDBDate(updateData.date_to);

      await pool.query(
        "UPDATE Subject_Schedule " +
          "SET " +
          "schedule_name = $1, " +
          "date_from = $2, " +
          "date_to = $3, " +
          "description = $4 " +
          "WHERE schedule_id = $5",
        [
          updateData.schedule_name,
          updateData.date_from,
          updateData.date_to,
          updateData.description,
          updateData.schedule_id,
        ]
      );

      return res.send({ success: true });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send({ success: false });
    }
  },
  /**
   * Create schedule of subject and returns success/error response
   * @returns {ChangeScheduleResponse}
   */
  createSchedule: async (req, res) => {
    try {
      let createData = req.body;
      createData.date_from = utils.convertDateToDBDate(createData.date_from);
      createData.date_to = utils.convertDateToDBDate(createData.date_to);

      subjectController
        .getSubjectId(createData.subject_name)
        .then(async (value) => {
          subjectId = value;

          await pool.query(
            "INSERT INTO Subject_Schedule(schedule_name, date_from, date_to, description, subject_id) " +
              "VALUES($1, $2, $3, $4, $5)",
            [
              createData.schedule_name,
              createData.date_from,
              createData.date_to,
              createData.description,
              subjectId,
            ]
          );

          return res.send({ success: true });
        });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send({ success: false });
    }
  },
  /**
   * Delete schedule of subject and returns success/error response
   * @returns {ChangeScheduleResponse}
   */
  deleteSchedule: async (req, res) => {
    try {
      const { scheduleId } = req.params;

      await pool.query("DELETE FROM Subject_Schedule WHERE schedule_id = $1", [
        scheduleId,
      ]);

      return res.send({ success: true });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send({ success: false });
    }
  },
};
