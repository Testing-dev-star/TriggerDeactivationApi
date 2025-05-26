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
  
conn.login(req.body.username, req.body.password, (err, userInfo) => {
  if (err) {
    console.error("Salesforce login failed:", err);
    return res.status(500).json({ error: "Salesforce authentication failed", details: err });
  }
}
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
