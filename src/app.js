const parsers = require("./parsers");
const LogicMonitorService = require("./logicmonitor.service");

async function getDeviceProperties(action, settings) {
  const deviceId = parsers.autocomplete(action.params.device);
  const client = LogicMonitorService.from(action.params, settings);
  return client.getDeviceProperties({deviceId});
}

async function ackAlerts(action, settings) {
  const alerts = parsers.autocompleteOrArray(action.params.alerts);
  const ackComment = parsers.string(action.params.comment);
  const client = LogicMonitorService.from(action.params, settings);
  return client.ackAlerts({alerts, ackComment});
}

async function getReportProperties(action, settings) {
  const reportId = parsers.autocomplete(action.params.report);
  const client = LogicMonitorService.from(action.params, settings);
  return client.getReportProperties({reportId});
}

async function runReports(action, settings) {
  const reports = parsers.autocompleteOrArray(action.params.reports);
  const receiveEmails = parsers.array(action.params.receiveEmails);
  const client = LogicMonitorService.from(action.params, settings);
  return client.runReports({reports, receiveEmails});
}

async function listDeviceGroups(action, settings) {
  const client = LogicMonitorService.from(action.params, settings);
  return client.listDeviceGroups({
    size: parsers.number(action.params.size),
    offset: parsers.number(action.params.offset)
  });
}

async function listDevices(action, settings) {
  const client = LogicMonitorService.from(action.params, settings);
  return client.listDevices({
    deviceGroup: parsers.autocomplete(action.params.deviceGroup),
    deviceType: action.params.deviceType,
    size: parsers.number(action.params.size),
    offset: parsers.number(action.params.offset)
  });
}

async function listReports(action, settings) {
  const client = LogicMonitorService.from(action.params, settings);
  return client.listReports({
    size: parsers.number(action.params.size),
    offset: parsers.number(action.params.offset)
  });
}

async function listAlerts(action, settings) {
  const client = LogicMonitorService.from(action.params, settings);
  return client.listAlerts({
    deviceGroup: parsers.autocomplete(action.params.deviceGroup),
    device: parsers.autocomplete(action.params.device),
    fromStart: parsers.datetime(action.params.fromStart),
    untilStart: parsers.datetime(action.params.untilStart),
    unacked: parsers.boolean(action.params.unacked),
    size: parsers.number(action.params.size),
    offset: parsers.number(action.params.offset)
  });
}

module.exports = {
  getDeviceProperties,
  ackAlerts,
  getReportProperties,
  runReports,
  listDevices,
  listAlerts,
  listReports,
  listDeviceGroups,
  // Autocomplete
  ...require("./autocomplete")
}
