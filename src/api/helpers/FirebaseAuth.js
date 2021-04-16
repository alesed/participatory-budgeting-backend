const admin = require("firebase-admin");

module.exports = {
  /**
   * Validate JWT token obtained from client (works as middleware)
   * @param {string} Bearer
   * @returns {success}
   */
  verifyJWTToken: async (req, res, next) => {
    if (!req.headers.authorization) {
      res.status(401).send("Unauthorized");
    }

    const token = req.headers.authorization.split(" ")[1];

    try {
      await admin
        .auth()
        .verifyIdToken(token)
        .then(() => {
          next();
        });
    } catch (err) {
      return res.status(401).send("Unauthorized");
    }
  },
};
