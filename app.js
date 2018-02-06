const rp = require('request-promise');
const parseXml = require('xml-parser');
const plexToken = '';
const devicesUrl = `https://plex.tv/devices.xml?X-Plex-Token=${plexToken}`;

function generateDeviceUrl(deviceId) {
    return `https://plex.tv/devices/${deviceId}.xml?X-Plex-Token=${plexToken}`;
}

function deleteDevice(deviceId) {
    return rp({
        method: 'DELETE',
        uri: generateDeviceUrl(deviceId)
    });
}

rp(devicesUrl).then(async xml => {
    console.log(xml);
    const json = parseXml(xml);
    const root = json.root;
    const nodeDevices = root.children.filter(x => x.attributes.name === 'Node.js App' && x.attributes.token !== plexToken);
    const deviceIds = nodeDevices.map(x => x.attributes.id);

    console.log(deviceIds.length);

    while (deviceIds.length) {
        const chunk = deviceIds.splice(0, 200);
        const result = await Promise.all(chunk.map(id => deleteDevice(id)));
        console.log(result);
        console.log(`200 done ${Date.now()}`);
    }

    console.log('done');
});