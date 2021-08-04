const parsers = require("./parsers");
const { sendRestAPI } = require("./helpers");

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
async function listDevicesAuto(query, pluginSettings, triggerParameters){
  const settings = mapAutoParams(pluginSettings); 
  const params = mapAutoParams(triggerParameters); 
  const deviceType = params.deviceType;
  let filter;
  if (deviceType && deviceType !== "Any") filter = {
      "deviceType": deviceType ? `:${deviceType}` : undefined,
  }
  const result = await sendRestAPI(params, settings, "GET", `/device/devices`, filter);
  return handleResult(result, query);
}

async function listAlertsAuto(query, pluginSettings, triggerParameters){
  const settings = mapAutoParams(pluginSettings); 
  const params = mapAutoParams(triggerParameters); 
  const device = parsers.autocomplete(params.device, true);
  let filter;
  if (query || device) filter = {
      "monitorObjectName": device ? `:${device}` : undefined,
      "_all": query ? `-${query}` : undefined
  }
  params.size = MAX_RESULTS;
  const result = sendRestAPI(params, settings, "GET", `/alert/alerts`, filter);
  return handleResult(result, query);
}

module.exports = {
  listDevicesAuto,
	listAlertsAuto
}