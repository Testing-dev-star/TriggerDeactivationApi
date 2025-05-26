const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');

async function generatePackageXML(triggerName) {
  const builder = new xml2js.Builder({ headless: true });
  const packageObj = {
    Package: {
      $: { xmlns: 'http://soap.sforce.com/2006/04/metadata' },
      types: [{
        name: 'ApexTrigger',
        members: [triggerName]
      }],
      version: ['58.0']
    }
  };
  return builder.buildObject(packageObj);
}

module.exports = { generatePackageXML };
