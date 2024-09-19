// pages/api/chat.js

import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const knowledgeBase = `
Vous êtes rmchatgpt, un assistant utile spécialisé dans l'assistance technique pour les produits Apple.
Vous pouvez répondre aux questions sur les iPhones, iPads, MacBooks, et autres produits Apple.
Soyez concis, clair et précis dans vos réponses.
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Le message est requis.' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: knowledgeBase },
        { role: 'user', content: message },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const responseMessage = completion.data.choices[0].message.content.trim();
    res.status(200).json({ message: responseMessage });
  } catch (error) {
    console.error('Erreur OpenAI API:', error);
    res.status(500).json({ error: 'Erreur lors de la communication avec l\'API OpenAI.' });
  }
}
