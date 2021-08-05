const parsers = require("./parsers");
const { listAlerts, listDevices } = require("./helpers");

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
 * @returns {Promise<[{id, value}]>} filtered result items
 ***/
async function handleResult(result, query, getName){
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

async function filterItems(items, query){
  if (query){
    const qWords = query.split(/[. ]/g).map(word => word.toLowerCase()); // split by '.' or ' ' and make lower case
    items = items.filter(item => qWords.every(word => item.value.toLowerCase().includes(word)));
    items = items.sort((word1, word2) => word1.value.toLowerCase().indexOf(qWords[0]) - word2.value.toLowerCase().indexOf(qWords[0]));
  }
  return items.splice(0, MAX_RESULTS);
}

// auto complete main methods
function listAuto(listFunc, getNameFunc){
  return async (query, pluginSettings, triggerParameters) => {
    const settings = mapAutoParams(pluginSettings), params = mapAutoParams(triggerParameters); 
    const result = await listFunc(params, settings);
    return handleResult(result.items, query, getNameFunc);
  }
}

module.exports = {
  listDevicesAuto: listAuto(listDevices),
	listAlertsAuto: listAuto(listAlerts, alert => 
    `${alert.id} ${alert.rule} ${alert.monitorObjectName} ` +
    `${alert.resourceTemplateName || ""}`)
}