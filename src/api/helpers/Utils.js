module.exports = {
  getCurrentYear: () => {
    return new Date().getFullYear();
  },
  convertToDate: (data) => {
    data.rows.forEach((element) => {
      element.date_from = Date.parse(element.date_from);
      element.date_to = Date.parse(element.date_to);
    });
    return data;
  },
  /**
   * Convert data (decision cast from string(/null) to boolean)
   * @param {RawProjectData} data
   * @returns {ConvertedProjectData}
   */
  convertProjectDecisionData: (data) => {
    data.rows.forEach((element) => {
      element.decision = element.decision ? !!parseInt(element.decision) : null;
    });
    return data;
  },
  /**
   * Convert JS Date to DB ready Date type ()
   * @param {object - {date_from: string, date_to: string}} data
   * @returns {string date ['MM-DD-YYYY']}
   */
  convertDateToDBDate: (date) => {
    const dateFrom = new Date(date);

    let day = dateFrom.getDate() + "";
    let month = dateFrom.getMonth() + 1 + "";
    const year = dateFrom.getFullYear() + "";

    if (day.length < 2) day = "0" + day;
    if (month.length < 2) month = "0" + month;

    return [year, month, day].join("-");
  },
};
