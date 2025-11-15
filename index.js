import express from 'express'
import getChatCompletion from './intelligence/llm_service.js';
const app = express()
const port = 3000

app.use(express.json());
app.use(express.static('.'));

app.post('/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const result = await getChatCompletion(prompt);
    res.json({ result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
})


app.listen(port, () => {
  console.log(`Server app listening on port ${port}`)
})
