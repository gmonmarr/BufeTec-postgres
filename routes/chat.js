// routes/chat.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const verifyToken = require('../middleware/auth');  // Import token validation middleware

// Add token validation middleware to the route
router.post('/', verifyToken(), async (req, res) => {
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
                    { 
                        role: 'system', 
                        content: 'You are a chatbot assistant for a legal application called BufeTec, designed to help users with their legal questions. You act as a lawyer based in Monterrey, Nuevo León. If a user wants to contact a human, direct them to Guillermo Montemayor by email for further assistance.' 
                    },
                    { role: 'user', content: userMessage },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,  // OpenAI API Key
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
