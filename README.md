# kaholo-plugin-logicmonitor
Kaholo plugin for integration with LogicMonitor API.

## Settings
1. Account Name (String) **Optional** - The name of the default account in LogicMonitor to connect to. Usually company name. Can be found in your logic monitor console URL, that follows this pattern: **https://{Account Name}.logicmonitor.com/santaba/ **.
2. Access ID (String) **Optional** - The access ID of LogicMonitor's default API token.
3. Access Key (Vault) **Optional** - The access key of LogicMonitor's default API token.

* **Please Notice!** You must provide those credentials either in the settings or for each method!

## Method: List Alerts
List all alerts. Can filter to return alerts of only specified device.

### Parameters
1. Account Name (String) **Optional** - The name of the account in LogicMonitor to connect to.
2. Access ID (String) **Optional** - The access ID of LogicMonitor's API token.
3. Access Key (Vault) **Optional** - The access key of LogicMonitor's API token.
4. Device Type (Options) **Optional** - If specified, show in the next parameter, "Device", only devices of the specified type. Possible values: Any | Regular | AWS | Azure
5. Device (Autocomplete) **Optional** - If specified, show only alerts from the specified device.
6. Size (String) **Optional** - Maximum number of alerts to return. Default is 5000.
7. Offset (String) **Optional** - The offset of the first alert to return, in case of paging.

## Method: Get Device Properties
Return all properties of the specified device.

### Parameters
1. Account Name (String) **Optional** - The name of the account in LogicMonitor to connect to.
2. Access ID (String) **Optional** - The access ID of LogicMonitor's API token.
3. Access Key (Vault) **Optional** - The access key of LogicMonitor's API token.
4. Device Type (Options) **Optional** - If specified, show in the next parameter, "Device", only devices of the specified type. Possible values: Any | Regular | AWS | Azure.
5. Device (Autocomplete) **Required** - The device to return his properties.

## Method: List Devices
List all devices, or all devices from the specified type.

### Parameters
1. Account Name (String) **Optional** - The name of the account in LogicMonitor to connect to.
2. Access ID (String) **Optional** - The access ID of LogicMonitor's API token.
3. Access Key (Vault) **Optional** - The access key of LogicMonitor's API token.
4. Device Type (Options) **Optional** - If specified, list only devices of the specified type. Possible values: Any | Regular | AWS | Azure
5. Size (String) **Optional** - Maximum number of devices to return. Default is 5000.
6. Offset (String) **Optional** - The offset of the first device to return, in case of paging.

## Method: Acknowledge Alerts
Acknowledge provided alerts

### Parameters
1. Account Name (String) **Optional** - The name of the account in LogicMonitor to connect to.
2. Access ID (String) **Optional** - The access ID of LogicMonitor's API token.
3. Access Key (Vault) **Optional** - The access key of LogicMonitor's API token.
4. Device Type (Options) **Optional** - If specified, show in the next parameter, "Device", only devices of the specified type. Possible values: Any | Regular | AWS | Azure.
5. Device (Autocomplete) **Optional** - If specified, show in the next parameter, "Alerts", only alerts from the specified device.
6. Alerts (Autocomplete / Array) **Optional** - The alerts to acknowledge. Can specify a single alert using autocomplete or multiple alerts by passing an array of alert IDs using code.
7. Acknowledge Comment (Text) **Required** - The comment to attach to this acknowledge.


## Method: List Reports
List all reports.

### Parameters
1. Account Name (String) **Optional** - The name of the account in LogicMonitor to connect to.
2. Access ID (String) **Optional** - The access ID of LogicMonitor's API token.
3. Access Key (Vault) **Optional** - The access key of LogicMonitor's API token.
4. Size (String) **Optional** - Maximum number of reports to return. Default is 5000.
5. Offset (String) **Optional** - The offset of the first report to return, in case of paging.

## Method: Get Report Properties
Get all properties of the specified report

### Parameters
1. Account Name (String) **Optional** - The name of the account in LogicMonitor to connect to.
2. Access ID (String) **Optional** - The access ID of LogicMonitor's API token.
3. Access Key (Vault) **Optional** - The access key of LogicMonitor's API token.
4. Report (Autocomplete) **Required** - The report to get back it's properties.

## Method: Run Reports
Generate the specified reports, and if specified any email address, email the report to them.

### Parameters
1. Account Name (String) **Optional** - The name of the account in LogicMonitor to connect to.
2. Access ID (String) **Optional** - The access ID of LogicMonitor's API token.
3. Access Key (Vault) **Optional** - The access key of LogicMonitor's API token.
4. Reports (Autocomplete) **Required** - The reports to run. Can specify a single report from autocomplete, or multiple reports by providing an array of report IDs from code.
5. Receive Emails (Text) **Optional** - If specified, send the generated reports to the specified emails. Can specifiy multiple emails by seperating each with a new line.
