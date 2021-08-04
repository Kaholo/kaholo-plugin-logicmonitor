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
Acknowledge Alerts

### Parameters
1. Account Name (String) **Optional** - The name of the account in LogicMonitor to connect to.
2. Access ID (String) **Optional** - The access ID of LogicMonitor's API token.
3. Access Key (Vault) **Optional** - The access key of LogicMonitor's API token.
4. Device Type (Options) **Optional** - If specified, show in the next parameter, "Device", only devices of the specified type. Possible values: Any | Regular | AWS | Azure.
5. Device (Autocomplete) **Optional** - If specified, show in the next parameter, "Alerts", only alerts from the specified device.
6. Alerts (Autocomplete / Array) **Optional** - The alerts to acknowledge. Can specify a single alert using autocomplete or multiple alerts by passing an array of alert IDs using code.
7. Acknowledge Comment (Text) **Required** - The comment to attach to this acknowledge.
