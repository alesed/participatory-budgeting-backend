const pool = require("../../config/db");
const utils = require("../helpers/Utils");
const nodemailer = require("nodemailer");

const subjectController = require("../controllers/Subject");

const crypto = require("crypto");

module.exports = {
  /**
   * Get one specific project
   * @param {number} projectId
   * @returns {project JSON}
   */
  getProjectDetail: async (req, res) => {
    try {
      const { projectId } = req.params;
      let subject = await pool.query(
        "SELECT project_id, project_name, author, author_email, date_created, category, description, geo_latitude, geo_longtitude, decision, decision_text " +
          "FROM Project " +
          "WHERE project_id = $1",
        [parseInt(projectId)]
      );
      if (subject.rowCount > 0) {
        subject = utils.convertProjectDecisionData(subject);
        res.json(subject.rows[0]);
      } else res.json(null);
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * Get photo of selected project
   * @param {number} projectId
   * @returns {project_photo JSON}
   */
  getProjectPhoto: async (req, res) => {
    try {
      const { projectId } = req.params;
      const subject = await pool.query(
        "SELECT photo_name, photo_path FROM Project_Photo WHERE project_id = $1",
        [parseInt(projectId)]
      );
      if (subject.rowCount > 0) res.json(subject.rows);
      else res.json(null);
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * Get all expenses of selected project
   * @param {number} projectId
   * @returns {project_expenses JSON}
   */
  getProjectExpenses: async (req, res) => {
    try {
      const { projectId } = req.params;
      const subject = await pool.query(
        "SELECT expense_name, expense_cost FROM Project_Expenses WHERE project_id = $1",
        [parseInt(projectId)]
      );
      if (subject.rowCount > 0) res.json(subject.rows);
      else res.json(null);
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * Update decision of project in DB
   * @returns {success}
   */
  updateDecisionOfProject: async (req, res) => {
    try {
      const decisionData = req.body;

      await pool.query(
        "UPDATE Project " +
          "SET decision = $1::bit, decision_text = $2 " +
          "WHERE project_id = $3",
        [
          decisionData.decision ? 1 : 0,
          decisionData.decisionText,
          decisionData.projectId,
        ]
      );

      return res.send({ success: true });
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * Send email with reference to new project
   * @returns {success}
   */
  doChangeRequest: async (req, res) => {
    try {
      const projectInput = req.body;

      const subjectName = projectInput.subjectName;
      const baseUrl = projectInput.baseUrl;

      const projectData = projectInput.projectData;
      const projectExpenses = projectInput.projectExpenses;

      const projectHash = crypto
        .createHash("sha1")
        .update(subjectName + projectData.project_id)
        .digest("hex");

      const acceptationURL =
        baseUrl +
        "/change-project/" +
        projectHash +
        "/" +
        projectData.project_id;

      const projectSuccess = await _createTemporaryProject(
        subjectName,
        projectData,
        projectExpenses
      );

      if (projectSuccess === true) {
        const oldProjectData = await pool.query(
          "SELECT * FROM Project WHERE project_id = $1",
          [projectData.project_id]
        );
        const oldProjectExpenses = await pool.query(
          "SELECT * FROM Project_Expenses WHERE project_id = $1",
          [projectData.project_id]
        );

        const emailSuccess = await _sendAcceptationEmailToAuthor(
          acceptationURL,
          projectData,
          projectExpenses,
          subjectName,
          oldProjectData.rows[0],
          oldProjectExpenses.rows
        );

        if (emailSuccess === true) {
          return res.send({ success: true });
        }
      }
      return res.send({ success: false });
    } catch (err) {
      return res.send({ success: false });
    }
  },
};

/**
 * Create temporary project which is a reference to real project
 * @param {string} acceptationURL
 * @param {ProjectData model} projectData
 * @param {string} subjectName
 * @returns {success}
 */
async function _createTemporaryProject(
  subjectName,
  projectData,
  projectExpenses
) {
  let result;
  try {
    await subjectController
      .getSubjectId(subjectName)
      .then(async (value) => {
        subjectId = value;
        createdProject = await pool.query(
          "INSERT INTO Project(project_id, project_name, author, author_email, date_created, category, description, geo_latitude, geo_longtitude, subject_id) " +
            "VALUES($1, $2, $3, $4, NOW(), $5, $6, $7, $8, $9) " +
            "RETURNING project_id",
          [
            projectData.project_id + 1000000,
            projectData.project_name,
            projectData.author,
            projectData.author_email,
            projectData.category,
            projectData.description,
            projectData.geo_latitude,
            projectData.geo_longtitude,
            subjectId,
          ]
        );

        projectExpenses.forEach(async (element) => {
          await pool.query(
            "INSERT INTO Project_Expenses(expense_name, expense_cost, project_id) " +
              "VALUES($1, $2, $3)",
            [
              element.expense_name,
              element.expense_cost,
              createdProject.rows[0].project_id,
            ]
          );
        });

        result = true;
      })
      .catch(() => {
        result = false;
        return;
      });
  } catch (err) {
    return result;
  }
  return result;
}

/**
 * Send email to author with proposed changes to be made and confirmation email link
 * @param {string} acceptationURL
 * @param {ProjectData model} projectData
 * @param {ProjectExpenses model} projectExpenses
 * @param {string} subjectName
 * @param {ProjectData model} oldProjectData
 * @param {ProjectExpenses model} oldProjectExpenses
 * @returns {success}
 */
async function _sendAcceptationEmailToAuthor(
  acceptationURL,
  projectData,
  projectExpenses,
  subjectName,
  oldProjectData,
  oldProjectExpenses
) {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    var emailOptions = {
      from: `"Participativní rozpočet" <${process.env.EMAIL_USER}>`,
      to: projectData.author_email,
      subject: `Změna projektu - ${subjectName}`,
      html: _getEmailTemplate(
        acceptationURL,
        projectData,
        projectExpenses,
        oldProjectData,
        oldProjectExpenses
      ),
    };

    await transporter.sendMail(emailOptions);

    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Create template of expenses including every element per line
 * @param {string} acceptationURL
 * @param {ProjectData model} projectData
 * @param {ProjectExpenses model} projectExpenses
 * @param {string} subjectName
 * @param {ProjectData model} oldProjectData
 * @param {ProjectExpenses model} oldProjectExpenses
 * @returns {string}
 */
function _getEmailTemplate(
  acceptationURL,
  projectData,
  projectExpenses,
  oldProjectData,
  oldProjectExpenses
) {
  let expensesTemplate = "";
  projectExpenses.forEach((element, index) => {
    expensesTemplate += `<p><strong>Název:</strong> ${oldProjectExpenses[index].expense_name} -> <strong>${element.expense_name}</strong>, <strong>Cena:</strong> ${oldProjectExpenses[index].expense_cost} kč -> <strong>${element.expense_cost} kč</strong></p>`;
  });

  return (
    `<h1>Prováděné změny:</h1> ` +
    `<p>(* tučně zvýrazněné jsou nové změny)</p> ` +
    `<h3>Název:</h3><p>${oldProjectData.project_name} -> <strong>${projectData.project_name}</strong></p>` +
    `<h3>Autor:</h3><p>${oldProjectData.author} -> <strong>${projectData.author}</strong></p>` +
    `<h3>Popis:</h3><p>${oldProjectData.description} -> <strong>${projectData.description}</strong></p>` +
    `</br>` +
    `<h3>Náklady:</h3><p>${expensesTemplate}</p>` +
    `</br></br></br>Akceptovat kliknutím na odkaz: ${acceptationURL}`
  );
}
