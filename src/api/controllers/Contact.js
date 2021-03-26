require("dotenv").config();

const pool = require("../../config/db");
const nodemailer = require("nodemailer");

module.exports = {
  /**
   * Retrieve description of subject visible on home page
   * @param {string} subjectName
   * @returns {description JSON}
   */
  getContactInformation: async (req, res) => {
    try {
      const { subjectName } = req.params;
      const information = await pool.query(
        "SELECT author, address, email, phone, facebook_url, instagram_url " +
          "FROM Subject " +
          "WHERE subject_name = $1",
        [subjectName]
      );

      if (information.rowCount > 0) res.json(information.rows[0]);
      else res.json(null);
    } catch (err) {
      console.error(err.message);
    }
  },
  /**
   * Send email via .env config including email data
   * @param {ContactFormData} emailData
   * @returns {response}
   */
  sendEmail: async (req, res) => {
    try {
      const emailData = req.body;

      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      var emailOptions = {
        from: `"Participativní rozpočet" <${emailData.email}>`,
        to: emailData.subjectEmail,
        subject: "Kontaktování obce skrze participativní rozpočet",
        html: `<h1>Zpráva:</h1><p>${emailData.message}</p><br/><p><strong>Email:</strong> ${emailData.email}</p><p><strong>Telefonní číslo:</strong> ${emailData.phone}</p>`,
      };

      await transporter.sendMail(emailOptions);

      return res.send({ success: true });
    } catch (err) {
      console.log(err.message);
      return res.send({ success: false });
    }
  },
};
