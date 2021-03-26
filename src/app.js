// CONFIG ==========================================================================
require("dotenv").config();

// CONTROLLERS =====================================================================
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

const sharedController = require("./api/controllers/Shared");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// MIDDLEWARE ======================================================================
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(cors());
app.use(express.json());

// ROUTES ==========================================================================
// subjects
app.get("/subject-exists/:subjectName", subjectController.isSubjectExisting);
app.get("/subjects", subjectController.getAllSubjects);
app.get("/subjects/:subjectName", subjectController.getOneSubject);

// home
app.get("/home/description/:subjectName", homeController.getHomeDescription);
app.get("/home/schedule/:subjectName", homeController.getHomeSchedule);

// proposal
app.post("/proposal/new-project", proposalController.saveNewProject);

// voting
app.post("/vote-projects", voteProjectController.getAllVoteProjects);
app.post("/vote/project", voteProjectController.voteForProject);
app.post("/vote/check", voteProjectController.checkVotesLimit);

// result
app.post("/result-projects", resultProjectController.getAllResultProjects);

// schedule
app.get("/schedule/:subjectName", scheduleController.getScheduleOfSubject);

// history
app.post("/history-projects", historyController.getAllHistoryProjects);

// contact
app.get("/contact/:subjectName", contactController.getContactInformation);
app.post("/contact/send-email", contactController.sendEmail);

// detail
app.get("/detail-project/:projectId", detailProjectController.getProjectDetail);
app.get(
  "/detail-project/photo/:projectId",
  detailProjectController.getProjectPhoto
);
app.get(
  "/detail-project/expenses/:projectId",
  detailProjectController.getProjectExpenses
);
app.post(
  "/detail-project/decide",
  detailProjectController.updateDecisionOfProject
);

// admin section
// decision
app.get(
  "/admin/decision/:subjectName",
  adminDecisionController.getDecisionProjects
);
// change-schedule
app.get(
  "/admin/schedule/:subjectName",
  adminChangeScheduleController.getAllSchedules
);
app.put("/admin/schedule/update", adminChangeScheduleController.updateSchedule);
app.post(
  "/admin/schedule/create",
  adminChangeScheduleController.createSchedule
);
app.delete(
  "/admin/schedule/delete/:scheduleId",
  adminChangeScheduleController.deleteSchedule
);
// polygon
app.get("/admin/polygon/:subjectName", adminPolygonController.getPolygon);
app.put("/admin/polygon/update", adminPolygonController.updatePolygon);
// settings
app.get("/admin/settings/:subjectName", adminSettingsController.getSettings);
app.put("/admin/settings/update", adminSettingsController.updateSettings);
app.put("/admin/settings/photo", adminSettingsController.updatePhoto);

// shared
app.get(
  "/shared/historic-years/:subjectName",
  sharedController.getDistinctHistoricYears
);

// APP =============================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
