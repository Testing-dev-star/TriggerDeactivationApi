const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');
const { generatePackageXML } = require('./packageHelper');

async function authenticateWithSalesforce({ clientId, clientSecret, username, password, loginUrl = 'https://login.salesforce.com' }) {
  const conn = new jsforce.Connection({
    oauth2: {
      clientId,
      clientSecret,
      loginUrl
    }
  });

  await conn.login(username, password);
  return conn;
}

async function deployTriggerToggle(conn, triggerName, enable) {
  const metadata = [{
    fullName: triggerName,
    metadata: {
      status: enable ? 'Active' : 'Inactive'
    }
  }];

  const deployResult = await conn.metadata.update('ApexTrigger', metadata);
  return deployResult;
}

module.exports = {
  authenticateWithSalesforce,
  deployTriggerToggle
};
