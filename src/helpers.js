const fetch = require('node-fetch');
const crypto = require("crypto");
const parsers = require("./parsers");

async function sendRestAPI(params, settings, httpMethod, resourcePath, filters, body){
    if (body) body = JSON.stringify(body);
    const accountName = parsers.string(params.accountName || settings.accountName);
    const accessId = parsers.string(params.accessId || settings.accessId);
    const accessKey = params.accessKey || settings.accessKey;
    if (!accountName || !accessId  || !accessKey){
        throw "One of required parameters was not given"
    }
    const size =  parsers.number(params.size);
    const offset = parsers.number(params.offset);
    // Create Auth Creds
    const epoch = (new Date).getTime();
    // Construct signature 
    const requestVars = httpMethod + epoch + (body || "") + resourcePath;
    const hex = crypto.createHmac("sha256", accessKey).update(requestVars).digest("hex");
    const signature = Buffer.from(hex).toString('base64');
    // Construct auth header
    const auth = "LMv1 " + accessId + ":" + signature + ":" + epoch;
    // Build and Send Request to API
    const opts = {
        method: httpMethod,
        headers: { 'Content-Type':'application/json', 'Authorization': auth }
    };
    if (httpMethod == "POST" && body) opts.body = body;

    const url = new URL(`https://${accountName}.logicmonitor.com/santaba/rest${resourcePath}`);
    
    if (filters || size || offset) {
        const search = {v: 2};
        if (filters) search.filter = Object.entries(filters).filter(
            ([key, val]) => key && val).map(keyVal => keyVal.join("")).join(",");
        if (size) search.size = size;
        if (offset) search.offset = offset;
        
        url.search = new URLSearchParams(search).toString();
    }

    const response = await fetch(url, opts);
    const result  = await response.json();
    if (!result.errmsg) return result;
    if (result.errmsg != "OK" || Math.floor(result.status / 100) !== 2) throw result;
    return result.data || result;
}


async function listDevices(params, settings) {
    const deviceType = params.deviceType;
    const filter = (deviceType && deviceType !== "any") ? {deviceType: `:${deviceType}`} : undefined;
    return sendRestAPI(params, settings, "GET", `/device/devices`, filter);
}

async function listAlerts(params, settings, unAcked) {
    const device = parsers.autocomplete(params.device);
    const filters = {};
    if (device) filters.deviceId = `:${device}`;
    if (unAcked) filters.acked = ":false";
    return sendRestAPI(params, settings, "GET", `/alert/alerts`, filters);
}

async function listReports(params, settings) {
    return sendRestAPI(params, settings, "GET", '/report/reports');
}

module.exports = {
    sendRestAPI,
    listDevices,
    listAlerts,
    listReports
}
