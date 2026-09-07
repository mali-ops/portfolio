// Vercel Serverless Function — keeps the Groq API key on the server.
// The browser never sees this key; it only talks to /api/chat.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'Server is missing GROQ_API_KEY. Add it in Vercel → Project → Settings → Environment Variables.'
    });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Missing messages array' });
  }

  // Keep the conversation short so each request stays fast.
  const trimmed = messages.slice(-20);

  const systemPrompt =
    "You are a friendly, helpful AI assistant embedded on Muhammad Ali's personal portfolio website " +
    '(an AI Engineer specializing in Generative AI, RAG, and workflow automation). You can chat about ' +
    'anything the visitor asks. If asked about Muhammad Ali specifically, you can mention he builds RAG ' +
    'pipelines, fine-tunes LLMs (Llama-3-8B with Unsloth), and automates workflows with n8n and Streamlit — ' +
    'and point visitors to the Projects and Contact sections for more. Keep replies concise and conversational.';

  try {
    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
        max_tokens: 1024,
        messages: [{ role: 'system', content: systemPrompt }, ...trimmed]
      })
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.error?.message || 'Upstream error' });
    }

    const reply = data?.choices?.[0]?.message?.content || '';
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach Groq API' });
  }
}
