const pool = require("../../config/db");
const utils = require("../helpers/Utils");
const crypto = require("crypto");

const subjectController = require("./Subject");

module.exports = {
  /**
   * Get all projects of subject (vote page)
   * @param {string} subjectName
   * @returns {projects JSON}
   */
  getAllVoteProjects: async (req, res) => {
    try {
      const subjectName = req.body.subjectName;
      let category = req.body.category;
      if (category != undefined) category = category.split(",");

      let projects;
      const currentYear = utils.getCurrentYear();
      if (category.length > 0 && category[0] != "") {
        projects = await pool.query(
          "SELECT project_id, project_name, category, photo_path, decision " +
            "FROM Project " +
            "INNER JOIN Subject USING (subject_id) " +
            "INNER JOIN Project_Photo USING (project_id) " +
            "WHERE subject_name = $1 AND category = ANY ($2) " +
            "AND EXTRACT(year FROM date_created) = $3 " +
            "ORDER BY decision DESC NULLS LAST",
          [subjectName, category, currentYear]
        );
      } else {
        projects = await pool.query(
          "SELECT project_id, project_name, category, photo_path, decision " +
            "FROM Project " +
            "INNER JOIN Subject USING (subject_id) " +
            "INNER JOIN Project_Photo USING (project_id) " +
            "WHERE subject_name = $1 " +
            "AND EXTRACT(year FROM date_created) = $2 " +
            "ORDER BY decision DESC NULLS LAST",
          [subjectName, currentYear]
        );
      }

      projects = utils.convertProjectDecisionData(projects);

      res.json(projects.rows);
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * Insert new vote for project
   * @param {number} projectId
   * @param {string} phoneNumber
   * @returns {Response}
   */
  voteForProject: async (req, res) => {
    try {
      const voteData = req.body;

      const phoneHash = crypto
        .createHash("sha1")
        .update(voteData.phoneNumber)
        .digest("hex");

      await _createUser(phoneHash, voteData.subjectName);
      await pool.query(
        "INSERT INTO Vote(date_voted, voter_hash, project_id) " +
          "VALUES(NOW(), $1, $2)",
        [phoneHash, voteData.projectId]
      );

      return res.send({ success: true });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send({ success: false });
    }
  },
  /**
   * Check if user already voted 3 times in one year or not
   * @param {string} phoneNumber
   * @returns {Response}
   */
  checkVotesLimit: async (req, res) => {
    try {
      const checkData = req.body;

      const phoneHash = crypto
        .createHash("sha1")
        .update(checkData.phoneNumber)
        .digest("hex");

      const currentYear = utils.getCurrentYear();

      const votes = await pool.query(
        "SELECT COUNT(*) as number_of_votes FROM Vote " +
          "WHERE " +
          "EXTRACT(year FROM date_voted) = $1 AND " +
          "voter_hash = $2 " +
          "GROUP BY voter_hash",
        [currentYear, phoneHash]
      );

      if (
        votes.rowCount === 0 ||
        (votes.rowCount > 0 && votes.rows[0].number_of_votes < 3)
      )
        return res.send({ success: true });
      else
        return res.send({
          success: false,
          message: " Vyčerpali jste počet hlasů (3).",
        });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send({ success: false });
    }
  },
};

/**
 * Check if user exists and if not create one
 * @param {string} phoneHash
 * @param {string} subjectName
 */
async function _createUser(phoneHash, subjectName) {
  try {
    const userExists = await pool.query(
      "SELECT subject_id FROM Voter " + "WHERE voter_hash = $1",
      [phoneHash]
    );

    if (userExists.rowCount === 0) {
      const subjectId = await subjectController.getSubjectId(subjectName);

      await pool.query(
        "INSERT INTO Voter(voter_hash, date_created, subject_id) " +
          "VALUES($1, NOW(), $2)",
        [phoneHash, subjectId]
      );
    }
  } catch (err) {
    console.error(err.message);
  }
}
