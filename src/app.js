const parsers = require("./parsers");
const helpers = require("./helpers");
const {sendRestAPI} = helpers;


async function getDeviceProperties(action, settings) {
  const deviceId = parsers.autocomplete(action.params.device);
  if (!deviceId) throw "Must specify device!";
  return sendRestAPI(action.params, settings, "GET", `/device/devices/${deviceId}/properties`);
}

async function ackAlerts(action, settings) {
  const alerts = parsers.autocompleteOrArray(action.params.alerts);
  const ackComment = action.params.comment;
  if (alerts.length < 1 || !ackComment){
    throw "Didn't provide one of the required parameters";
  } 
  return Promise.all(alerts.map(alertId => sendRestAPI(
    action.params, 
    settings, 
    "POST", // http method
    `/alert/alerts/${alertId}/ack`, // api path
    undefined, // filter param
    {ackComment} // body
  )))
}

async function getReportProperties(action, settings) {
  const reportId = parsers.autocomplete(action.params.report);
  if (!reportId) throw "Must specify report!";
  return sendRestAPI(action.params, settings, "GET", `/report/reports/${reportId}`);
}

async function runReports(action, settings) {
  const reports = parsers.autocompleteOrArray(action.params.reports);
  const receiveEmails = parsers.array(action.params.receiveEmails).join(",");
  if (reports.length < 1) throw "Must specify report!";
  const funcBody = {
    type: "generateReport"
  }
  if (receiveEmails) funcBody.receiveEmails = receiveEmails;
  return Promise.all(reports.map(reportId => sendRestAPI(
    action.params, 
    settings, 
    "POST", // http method
    `/functions`, // api path
    undefined, // filter param
    { // body
      ...funcBody,
      reportId: reportId
    }
  )))
}

module.exports = {
  getDeviceProperties,
  ackAlerts,
  getReportProperties,
  runReports,
  listDevices: (action, settings) => helpers.listDevices(action.params, settings),
  listAlerts: (action, settings) => helpers.listAlerts(action.params, settings),
  listReports: (action, settings) => helpers.listReports(action.params, settings),
  // Autocomplete
  ...require("./autocomplete")
}
