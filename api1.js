const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const secret = 'YOUR_SECRET'; // Replace with your actual secret

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);

  if (!signature) {
    return res.status(403).send('No signature');
  }

  const hmac = crypto.createHmac('sha256', secret);
  const digest = `sha256=${hmac.update(payload).digest('hex')}`;

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
    console.log('Commit received:', req.body);
    res.status(200).send('Webhook received');
  } else {
    res.status(403).send('Invalid signature');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});