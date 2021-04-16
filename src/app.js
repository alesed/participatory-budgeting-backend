// CONFIG ==========================================================================
require("dotenv").config();
const firebaseAuth = require("./api/helpers/FirebaseAuth");

// CONTROLLERS =====================================================================
const landingController = require("./api/controllers/Landing");

const subjectController = require("./api/controllers/Subject");
const homeController = require("./api/controllers/Home");
const proposalController = require("./api/controllers/Proposal");
const voteProjectController = require("./api/controllers/VoteProject");
const resultProjectController = require("./api/controllers/ResultProject");
const scheduleController = require("./api/controllers/Schedule");
const historyController = require("./api/controllers/HistoryProject");
const contactController = require("./api/controllers/Contact");
const detailProjectController = require("./api/controllers/DetailProject");

const adminDecisionController = require("./api/controllers/admin/Decision");
const adminChangeScheduleController = require("./api/controllers/admin/ChangeSchedule");
const adminPolygonController = require("./api/controllers/admin/Polygon");
const adminSettingsController = require("./api/controllers/admin/Settings");
const changeProjectController = require("./api/controllers/ChangeProject");

const sharedController = require("./api/controllers/Shared");

const serviceAccount = require("../serviceAccountKey.json");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

const app = express();

// MIDDLEWARE ======================================================================
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(cors());
app.use(express.json());

// ROUTES ==========================================================================
// landing
app.post(
  "/api/landing/send-proposal-email",
  landingController.sendProposalEmail
);
app.post("/api/landing/send-contact-email", landingController.sendContactEmail);

// subjects
app.get(
  "/api/subject-exists/:subjectName",
  subjectController.isSubjectExisting
);
app.get("/api/subjects", subjectController.getAllSubjects);
app.get("/api/subjects/:subjectName", subjectController.getOneSubject);

// home
app.get(
  "/api/home/description/:subjectName",
  homeController.getHomeDescription
);
app.get("/api/home/schedule/:subjectName", homeController.getHomeSchedule);

// proposal
app.post("/api/proposal/new-project", proposalController.saveNewProject);

// voting
app.post("/api/vote-projects", voteProjectController.getAllVoteProjects);
app.post("/api/vote/project", voteProjectController.voteForProject);
app.post("/api/vote/check", voteProjectController.checkVotesLimit);

// result
app.post("/api/result-projects", resultProjectController.getAllResultProjects);

// schedule
app.get("/api/schedule/:subjectName", scheduleController.getScheduleOfSubject);

// history
app.post("/api/history-projects", historyController.getAllHistoryProjects);

// contact
app.get("/api/contact/:subjectName", contactController.getContactInformation);
app.post("/api/contact/send-email", contactController.sendEmail);

// detail
app.get(
  "/api/detail-project/:projectId",
  detailProjectController.getProjectDetail
);
app.get(
  "/api/detail-project/photo/:projectId",
  detailProjectController.getProjectPhoto
);
app.get(
  "/api/detail-project/expenses/:projectId",
  detailProjectController.getProjectExpenses
);
app.post(
  "/api/detail-project/decide",
  firebaseAuth.verifyJWTToken,
  detailProjectController.updateDecisionOfProject
);
app.post(
  "/api/detail-project/update",
  firebaseAuth.verifyJWTToken,
  detailProjectController.doChangeRequest
);

// admin section
// decision
app.get(
  "/api/admin/decision/:subjectName",
  firebaseAuth.verifyJWTToken,
  adminDecisionController.getDecisionProjects
);
// change-schedule
app.get(
  "/api/admin/schedule/:subjectName",
  firebaseAuth.verifyJWTToken,
  adminChangeScheduleController.getAllSchedules
);
app.put(
  "/api/admin/schedule/update",
  firebaseAuth.verifyJWTToken,
  adminChangeScheduleController.updateSchedule
);
app.post(
  "/api/admin/schedule/create",
  firebaseAuth.verifyJWTToken,
  adminChangeScheduleController.createSchedule
);
app.delete(
  "/api/admin/schedule/delete/:scheduleId",
  firebaseAuth.verifyJWTToken,
  adminChangeScheduleController.deleteSchedule
);
// polygon
app.get("/api/admin/polygon/:subjectName", adminPolygonController.getPolygon);
app.put(
  "/api/admin/polygon/update",
  firebaseAuth.verifyJWTToken,
  adminPolygonController.updatePolygon
);
// settings
app.get(
  "/api/admin/settings/:subjectName",
  adminSettingsController.getSettings
);
app.put(
  "/api/admin/settings/update",
  firebaseAuth.verifyJWTToken,
  adminSettingsController.updateSettings
);
app.put(
  "/api/admin/settings/photo",
  firebaseAuth.verifyJWTToken,
  adminSettingsController.updatePhoto
);

// change-project
app.post(
  "/api/change-project",
  changeProjectController.updatePendingProjectChange
);

// shared
app.get(
  "/api/shared/historic-years/:subjectName",
  sharedController.getDistinctHistoricYears
);

// APP =============================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
