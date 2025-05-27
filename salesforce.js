const jsforce = require('jsforce');
const fs = require('fs');
const path = require('path');
const { generatePackageXML } = require('./packageHelper');

async function authenticateWithSalesforce({ clientId, clientSecret, username, password, loginUrl = 'https://test.salesforce.com' }) {
  const conn = new jsforce.Connection({
    oauth2: {
      clientId,
      clientSecret,
      loginUrl
    }
  });

  try {
    await conn.login(username, password);
    return conn;
  } catch (err) {
    console.error('Salesforce login failed:', err);
    throw new Error('Salesforce authentication failed');
  }
}

async function deployTriggerToggle(conn, triggerName, enable) {
  const metadata = [{
    fullName: triggerName,
    status: enable ? 'Active' : 'Inactive'
  }];

  try {
    const result = await conn.metadata.update('ApexTrigger', metadata);
    return result;
  } catch (err) {
    console.error('Metadata update failed:', err);
    throw new Error('Failed to update trigger status', err);
  }
}

module.exports = {
  authenticateWithSalesforce,
  deployTriggerToggle
};
