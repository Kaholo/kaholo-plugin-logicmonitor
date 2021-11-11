const fetch = require('node-fetch');
const parsers = require("./parsers");
const crypto = require("crypto");

module.exports = class LogicMonitorService{
    constructor({accountName, accessId, accessKey}){
        if (!accountName || !accessId || !accessKey) throw "One of the required parameters was not provided"; 
        this.url = `https://${accountName}.logicmonitor.com/santaba/rest/`; 
        this.accessId = accessId; this.accessKey = accessKey;
    }

    static from(params, settings){
        return new LogicMonitorService({
            accountName: parsers.string(params.accountName || settings.accountName),
            accessId: parsers.string(params.accessId || settings.accessId),
            accessKey: params.accessKey || settings.accessKey
        });
    }

    async sendRequest({httpMethod, path, body, searchParams}){
        if (body) body = JSON.stringify(body);
        // Create Auth Creds
        const epoch = (new Date).getTime();
        // Construct signature 
        const requestVars = httpMethod + epoch + (body || "") + path;
        const hex = crypto.createHmac("sha256", this.accessKey).update(requestVars).digest("hex");
        const signature = Buffer.from(hex).toString('base64');
        // Construct auth header
        const auth = "LMv1 " + this.accessId + ":" + signature + ":" + epoch;
        // Build and Send Request to API
        const opts = {
            method: httpMethod,
            headers: { 'Content-Type':'application/json', 'Authorization': auth }
        };
        if (httpMethod == "POST" && body) opts.body = body;
        const url = new URL(this.url + path);
        if (searchParams){
            url.search = new URLSearchParams(searchParams).toString();
        }
        var result;
        try {
            const response = await fetch(url, opts);
            result  = await response.json();
        }
        catch(err){
            throw `Problem with sending request to ${url}: ${err.message || JSON.stringify(err)}`;
        }
        if (!result.errmsg) return result;
        if (result.errmsg != "OK" || Math.floor(result.status / 100) !== 2) throw result;
        return result.data || result;
    }

    async getDeviceProperties({deviceId}) {
        if (!deviceId) throw "Must specify device!";
        return this.sendRequest({
            httpMethod: "GET",
            path: `device/devices/${deviceId}/properties`
        });
    }
    
    async ackAlerts({alerts, ackComment}) {
        if (!alerts || alerts.length < 1 || !ackComment) throw "Didn't provide one of the required parameters";
        return Promise.all(alerts.map(alertId => this.sendRequest({
            httpMethod: "POST",
            path: `alert/alerts/${alertId}/ack`,
            body: {ackComment}
        })));
    }
    
    async getReportProperties({reportId}) {
        if (!reportId) throw "Must specify report!";
        return this.sendRequest({
            httpMethod: "GET",
            path: `/report/reports/${reportId}`
        });
    }
    
    async runReports({reports, receiveEmails}) {
        if (reports.length < 1) throw "Must specify report!";
        return Promise.all(reports.map(reportId => {
            const body = {type: "generateReport", reportId};
            if (receiveEmails && receiveEmails.length > 0){
                body.receiveEmails = receiveEmails.join(",");
            }
            return this.sendRequest({
                httpMethod: "POST",
                path: "functions",
                body
            });
        }));
    }

    async listResources({path, filters, offset, size}){
        var searchParams;
        if (filters || size || offset) {
            searchParams = {v: 2};
            if (filters){
                if (!Array.isArray(filters)) filters = Object.entries(filters);
                searchParams.filter = filters.filter(([key, val]) => key && val).map(keyVal => keyVal.join("")).join(",");
            } 
            if (size) searchParams.size = size;
            if (offset) searchParams.offset = offset;
        }
        return this.sendRequest({httpMethod: 'GET', path, searchParams});
    }

    async listDevices({deviceGroup, deviceType, size, offset}) {
        const filters = (deviceType && deviceType !== "any") ? 
                        {deviceType: `:${deviceType}`} : undefined;
        const path = deviceGroup ? `device/groups/${deviceGroup}/devices` : 'device/devices';
        return this.listResources({path, filters, size, offset});
    }

    async listAlerts({deviceGroup, device, fromStart, untilStart, unacked, size, offset}) {
        const filters = []; // an array of key and values, because of possible duplicate key
        if (device) filters.push(["deviceId", `:${device}`]);
        if (unacked) filters.push(["acked", `:false`]);
        if (fromStart) filters.push(["startEpoch", `>${fromStart.getTime()}`]);
        if (untilStart) filters.push(["startEpoch", `<${untilStart.getTime()}`]);
        const path = deviceGroup ? `device/groups/${deviceGroup}/alerts` : 'alert/alerts';
        return this.listResources({path, filters, size, offset});
    }

    async listUnackedAlerts(params){
        return this.listAlerts({
            ...params,
            unacked: true
        });
    }

    async listReports({size, offset}) {
        return this.listResources({path: 'report/reports', size, offset});
    }

    async listDeviceGroups({size, offset}) {
        return this.listResources({path: 'device/groups', size, offset});
    }
}