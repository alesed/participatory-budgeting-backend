const pool = require("../../config/db");
const utils = require("../helpers/Utils");

module.exports = {
  /**
   * Retrieve distinct years of projects
   * @param {string} subjectName
   * @returns {distinct_years number[]}
   */
  getDistinctHistoricYears: async (req, res) => {
    try {
      const { subjectName } = req.params;
      let distinctYears = await pool.query(
        "SELECT DISTINCT(DATE_PART('year', date_created::date)) AS distinct_year " +
          "FROM Project " +
          "INNER JOIN Subject USING (subject_id) " +
          "WHERE subject_name = $1",
        [subjectName]
      );

      if (distinctYears.rowCount > 0) {
        distinctYears = _convertDistinctYears(distinctYears);
        res.json(distinctYears);
      } else res.json(null);
    } catch (err) {
      console.error(err.message);
    }
  },
};

/**
 * Convert JSON of distinct years to array and exclude current year
 * @param {distinct_years JSON} data
 * @returns {number[]}
 */
function _convertDistinctYears(data) {
  let yearsArray = [];
  data.rows.forEach((element) => {
    yearsArray.push(element.distinct_year);
  });

  const currentYear = utils.getCurrentYear();
  return yearsArray.filter((element) => element != currentYear);
}
