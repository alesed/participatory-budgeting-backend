const pool = require("../../../config/db");

module.exports = {
  /**
   * Retrieve settings of subject from DB
   * @param {string} subjectName
   * @returns {settings JSON}
   */
  getSettings: async (req, res) => {
    try {
      const { subjectName } = req.params;

      const settings = await pool.query(
        "SELECT subject_id, description, author, address, email, phone, photo, facebook_url, instagram_url " +
          "FROM Subject " +
          "WHERE subject_name = $1",
        [subjectName]
      );

      if (settings.rowCount > 0) res.json(settings.rows[0]);
      else res.json(null);
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * Update settings of subject in DB
   * @param {updateDataModel} updateData
   * @returns {success}
   */
  updateSettings: async (req, res) => {
    try {
      const updateData = req.body;

      await pool.query(
        "UPDATE Subject " +
          "SET " +
          "description = $1, " +
          "author = $2, " +
          "address = $3, " +
          "email = $4, " +
          "phone = $5, " +
          "facebook_url = $6, " +
          "instagram_url = $7 " +
          "WHERE subject_id = $8",
        [
          updateData.description,
          updateData.author,
          updateData.address,
          updateData.email,
          updateData.phone,
          updateData.facebook_url,
          updateData.instagram_url,
          updateData.subject_id,
        ]
      );

      return res.send({ success: true });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send({ success: false });
    }
  },
  updatePhoto: async (req, res) => {
    try {
      const updatePhotoData = req.body;

      await pool.query(
        "UPDATE Subject SET photo = $1 WHERE subject_name = $2",
        [updatePhotoData.subjectPhotoUrl, updatePhotoData.subjectName]
      );

      return res.send({ success: true });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send({ success: false });
    }
  },
};
