import express from 'express'
import main from './intelligence/model_call.js';
const app = express()
const port = 3000

app.get('/good', async (req, res) => {
  try {
    const result = await main({ tone: 'good' });
    res.send(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error: ' + error.message);
  }
})

app.get('/evil', async (req, res) => {
  try {
    const result = await main({ tone: 'evil' });
    res.send(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error: ' + error.message);
  }
})

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`)
})