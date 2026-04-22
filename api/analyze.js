export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, system } = req.body;

    const userMessage = messages?.[0]?.content || "";
    const prompt = `${system}\n\nUser request: ${userMessage}`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            response_mime_type: "application/json", // 🔥 THIS IS THE FIX
            temperature: 0.3
          }
        })
      }
    );

    const data = await response.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.status(200).json({
      content: [{ text }]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
