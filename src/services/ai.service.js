const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const generateWellnessResponse = async (
    userMessage,
    conversationHistory = []
) => {
    try {
        const messages = [
            {
                role: "system",
                content: `You are a supportive Wellness Assistant designed for students.

Your purpose is to provide general wellness guidance and emotional support.

Rules:
1. Be friendly, calm, and empathetic.
2. Do not diagnose mental health conditions.
3. Do not claim to be a doctor or therapist.
4. Do not provide medication or treatment instructions.
5. Suggest healthy activities such as breathing exercises, relaxation, journaling, and taking breaks.
6. Keep responses clear and easy for students to understand.
7. If the user appears to be in immediate danger or may harm themselves or someone else, encourage them to contact local emergency services and seek immediate help from a trusted person nearby.`,
            },

            ...conversationHistory.map((item) => ({
                role:
                    item.sender === "assistant"
                        ? "assistant"
                        : "user",

                content: item.message,
            })),

            {
                role: "user",
                content: userMessage,
            },
        ];

        const response =
            await groq.chat.completions.create({
                messages,
                model: "openai/gpt-oss-20b",
                temperature: 0.7,
                max_tokens: 500,
            });

        return response.choices[0]?.message?.content
            || "I'm sorry, I couldn't generate a response right now.";

    } catch (error) {
        console.error(
            "Groq AI service error:",
            error
        );

        throw new Error(
            "Could not generate AI response"
        );
    }
};

module.exports = {
    generateWellnessResponse,
};