require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { authenticateWithSalesforce, deployTriggerToggle } = require('./salesforce');

const app = express();
app.use(bodyParser.json());

app.post('/api/toggle-trigger', async (req, res) => {
  const { clientId, clientSecret, username, password, loginUrl, triggerName, enable } = req.body;

  if (!clientId || !clientSecret || !username || !password || !triggerName || enable === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const conn = await authenticateWithSalesforce({ clientId, clientSecret, username, password, loginUrl });
    const result = await deployTriggerToggle(conn, triggerName, enable);
    res.json({ message: `Trigger ${triggerName} ${enable ? 'enabled' : 'disabled'}`, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
