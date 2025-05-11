const express = require('express');
const app = express();
app.use(express.json());

app.post('/send-message', (req, res) => {
  const { campaignId, customerId } = req.body;
  const isSuccess = Math.random() < 0.9; // 90% success rate

  // Simulate delay
  setTimeout(() => {
    // Simulate callback to delivery receipt endpoint
    fetch('http://localhost:5000/api/delivery-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        receipts: [
          {
            campaignId,
            customerId,
            status: isSuccess ? 'SENT' : 'FAILED'
          }
        ]
      })
    });
  }, 1000);

  res.status(200).json({ status: isSuccess ? 'SENT' : 'FAILED' });
});

app.listen(6000, () => {
  console.log('Vendor API running on port 6000');
});
