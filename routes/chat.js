
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'No message provided' });
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: userMessage },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        const botMessage = response.data.choices[0].message.content;
        res.json({ response: botMessage.trim() });
    } catch (error) {
        console.error('Error al hacer la solicitud a OpenAI:', error);
        res.status(500).json({ error: 'Error al obtener respuesta del chatbot' });
    }
});

module.exports = router;
