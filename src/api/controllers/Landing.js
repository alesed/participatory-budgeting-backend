const nodemailer = require("nodemailer");

module.exports = {
  /**
   * Send email regarding proposal of new subject
   * @param {LandingProposalData} proposalInput
   * @returns {success}
   */
  sendProposalEmail: async (req, res) => {
    try {
      const proposalInput = req.body;

      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      var emailOptions = {
        from: `"Participativní rozpočet" <${proposalInput.email}>`,
        to: process.env.EMAIL_USER,
        subject: "Žádost o nový participativní rozpočet",
        html: `<h1>Zpráva:</h1><p>Uživatel žádá o vlastní systém pro participativní rozpočet!</p><br/><p><strong>Email:</strong> ${proposalInput.email}</p><p><strong>Telefonní číslo:</strong> ${proposalInput.phone}</p>`,
      };

      await transporter.sendMail(emailOptions);

      return res.send({ success: true });
    } catch (err) {
      console.error(err.message);
      return res.send({ success: false });
    }
  },
  /**
   * Send email regarding contacting administrator of participatory budgeting IS
   * @param {LandingProposalData} contactInput
   * @returns {success}
   */
  sendContactEmail: async (req, res) => {
    try {
      const contactInput = req.body;

      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      var emailOptions = {
        from: `"Participativní rozpočet" <${contactInput.email}>`,
        to: process.env.EMAIL_USER,
        subject: `Kontakt - ${contactInput.author}`,
        html: `<h1>Zpráva:</h1><p>${contactInput.message}</p><br/><p><strong>Email:</strong> ${contactInput.email}</p><p><strong>Telefonní číslo:</strong> ${contactInput.phone}</p>`,
      };

      await transporter.sendMail(emailOptions);

      return res.send({ success: true });
    } catch (err) {
      console.error(err.message);
      return res.send({ success: false });
    }
  },
};
