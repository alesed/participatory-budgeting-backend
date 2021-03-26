const pool = require("../../../config/db");

const subjectController = require("../../controllers/Subject");

module.exports = {
  /**
   * Retrieve polygon data in JSON format including center of polygon from DB
   * @param {string} subjectName
   * @returns {PolygonCoordsData - JSON}
   */
  getPolygon: async (req, res) => {
    try {
      const { subjectName } = req.params;

      const polygon = await pool.query(
        "SELECT polygon_data FROM Subject_Polygon " +
          "INNER JOIN Subject USING (subject_id) " +
          "WHERE subject_name = $1",
        [subjectName]
      );

      if (polygon.rowCount > 0) res.json(polygon.rows[0].polygon_data);
      else res.json(null);
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * If polygon exists -> update data. Otherwise insert new row into DB
   * @param {PolygonCoordsData} newPolygon
   * @returns {response}
   */
  updatePolygon: async (req, res) => {
    try {
      const newPolygon = req.body;

      // check if polygon already exists
      const polygonExists = await pool.query(
        "SELECT subject_id FROM Subject_Polygon " +
          "INNER JOIN Subject USING (subject_id) " +
          "WHERE subject_name = $1",
        [newPolygon.subjectName]
      );

      // -> exists
      // update existing polygon row
      if (polygonExists.rowCount > 0) {
        await pool.query(
          "UPDATE Subject_Polygon " +
            "SET polygon_data = $1 " +
            "FROM Subject " +
            "WHERE Subject.subject_id = Subject_Polygon.subject_id AND subject_name = $2",
          [newPolygon.polygonData, newPolygon.subjectName]
        );
      }
      // -> does not exist
      else {
        // get subject id
        subjectController
          .getSubjectId(newPolygon.subjectName)
          .then(async (value) => {
            subjectId = value;

            // create polygon row in DB
            await pool.query(
              "INSERT INTO Subject_Polygon(polygon_data, subject_id) " +
                "VALUES($1, $2)",
              [newPolygon.polygonData, subjectId]
            );
          });
      }

      return res.send({ success: true });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send({ success: false });
    }
  },
};
