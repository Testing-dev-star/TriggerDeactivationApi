const express = require('express');
const bodyParser = require('body-parser');
const jsforce = require('jsforce');
const dotenv = require('dotenv');
const { deployTriggerMetadataOnly } = require('./deployTriggerMetaOnly');

dotenv.config();

const app = express();
app.use(bodyParser.json());

async function loginToSalesforce({ clientId, clientSecret, username, password, loginUrl }) {
const conn = new jsforce.Connection({
loginUrl,
oauth2: { clientId, clientSecret }
});

await conn.login(username, password);
return conn;
}

app.post('/api/toggle-trigger', async (req, res) => {
try {
const {
clientId,
clientSecret,
username,
password,
loginUrl = 'https://login.salesforce.com',
triggerName,
apiVersion = '63.0',
enable
} = req.body;

pgsql
Copy
Edit
if (!clientId || !clientSecret || !username || !password || !triggerName || enable === undefined) {
  return res.status(400).json({ error: 'Missing required parameters' });
}

const conn = await loginToSalesforce({ clientId, clientSecret, username, password, loginUrl });
const result = await deployTriggerMetadataOnly(conn, triggerName, apiVersion, enable);

res.json({
  message: `Trigger "${triggerName}" successfully ${enable ? 'enabled' : 'disabled'}`,
  deploymentId: result.id,
  details: result
});
} catch (err) {
res.status(500).json({ error: err.message });
}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server running on port ${PORT}));
