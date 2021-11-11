const parsers = require("./parsers");
const LogicMonitorService = require("./logicmonitor.service");

// auto complete helper methods

const MAX_RESULTS = 10;

function mapAutoParams(autoParams){
  const params = {};
  autoParams.forEach(param => {
    params[param.name] = parsers.autocomplete(param.value);
  });
  return params;
}

/***
 * @returns {[{id, value}]} filtered result items
 ***/
function handleResult(result, query, getName){
  const items = result.map(item => {
    if (item.id && typeof(item.id) === "number") item.id = item.id.toString();
    const val = getName ? getName(item) :
                item.name ? item.name :
                item.displayName ? item.displayName : item.id;
    return {
      id:     item.id || val, 
      value:  val
    };
  });
  return filterItems(items, query);
}

function filterItems(items, query){
  if (query){
    const qWords = query.split(/[. ]/g).map(word => word.toLowerCase()); // split by '.' or ' ' and make lower case
    items = items.filter(item => qWords.every(word => item.value.toLowerCase().includes(word)));
    items = items.sort((word1, word2) => word1.value.toLowerCase().indexOf(qWords[0]) - word2.value.toLowerCase().indexOf(qWords[0]));
  }
  return items.slice(0, MAX_RESULTS);
}

// auto complete main methods
function listAuto(listFunc, getNameFunc){
  return async (query, pluginSettings, triggerParameters) => {
    const settings = mapAutoParams(pluginSettings), params = mapAutoParams(triggerParameters);
    const client = LogicMonitorService.from(params, settings);
    const bufferSize = 100, items = [];
    var lastResult, offset = 0;
    do {
      lastResult = await client[listFunc]({
        ...params,
        size: bufferSize,
        offset
      });
      items.push(...handleResult(lastResult.items || [], query, getNameFunc));
      offset += bufferSize;
    } while (items.length < MAX_RESULTS && lastResult.items && lastResult.items.length == bufferSize);
    return items;
  }
}

const getAlertDisplayName = alert => `${alert.id} ${alert.rule} ${alert.monitorObjectName} ${alert.resourceTemplateName || ""}`;

module.exports = {
  listDevicesAuto: listAuto("listDevices"),
  listReportsAuto: listAuto("listReports"),
	listAlertsAuto: listAuto("listAlerts", getAlertDisplayName),
	listUnackedAlertsAuto: listAuto("listUnackedAlerts", getAlertDisplayName),
	listDeviceGroupsAuto: listAuto("listDeviceGroups")
}