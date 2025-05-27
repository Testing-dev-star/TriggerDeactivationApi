const JSZip = require('jszip');

function buildTriggerMetaXml(apiVersion, status) {
return <?xml version="1.0" encoding="UTF-8"?> <ApexTrigger xmlns="http://soap.sforce.com/2006/04/metadata"> <apiVersion>${apiVersion}</apiVersion> <status>${status}</status> </ApexTrigger>;
}

function buildPackageXml(triggerName, apiVersion) {
return <?xml version="1.0" encoding="UTF-8"?> <Package xmlns="http://soap.sforce.com/2006/04/metadata"> <types> <members>${triggerName}</members> <name>ApexTrigger</name> </types> <version>${apiVersion}</version> </Package>;
}

async function buildDeploymentZip(triggerName, apiVersion, status) {
const zip = new JSZip();
const folder = zip.folder('unpackaged');

const triggerMeta = buildTriggerMetaXml(apiVersion, status);
const packageXml = buildPackageXml(triggerName, apiVersion);

folder.file(${triggerName}.trigger-meta.xml, triggerMeta);
folder.file(package.xml, packageXml);

return await zip.generateAsync({ type: 'nodebuffer' });
}

async function deployTriggerMetadataOnly(conn, triggerName, apiVersion, enable) {
const status = enable ? 'Active' : 'Inactive';
const zipBuffer = await buildDeploymentZip(triggerName, apiVersion, status);
const result = await conn.metadata.deploy(zipBuffer, { singlePackage: true }).complete({ details: true });

if (!result.success) {
const errorDetails = result.details.componentFailures;
throw new Error(Deployment failed: ${JSON.stringify(errorDetails, null, 2)});
}

return result;
}

module.exports = { deployTriggerMetadataOnly };
