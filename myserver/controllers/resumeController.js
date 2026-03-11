import fs from "fs/promises";
import pdf from "pdf-parse-fork";
import { HfInference } from "@huggingface/inference";

export const enhanceResume = async (req, res) => {
    console.log("--- 🚀 ENHANCE PROCESS STARTED (Stability Mode) ---");
    const file = req.file;
    const { targetRole } = req.body;

    try {
        if (!file) return res.status(400).json({ error: "No file uploaded" });

        // 1. Setup Inference
        const hf = new HfInference(process.env.HF_API_KEY);

        // 2. Extract Text
        const dataBuffer = await fs.readFile(file.path);
        const pdfData = await pdf(dataBuffer);
        const extractedText = pdfData.text.replace(/\s+/g, ' ').substring(0, 2500);
        console.log("📝 PDF Extracted. Length:", extractedText.length);

        // 3. Request AI (Using Qwen 2.5 - the most stable HF native model)
        console.log("🤖 Requesting AI from HF Native Provider...");
        
        const response = await hf.chatCompletion({
            model: 'Qwen/Qwen2.5-7B-Instruct', // Fixed model known for high availability
            messages: [
                {
                    role: "system",
                    content: "You are a professional career coach. Provide 3 brief, actionable suggestions for this resume."
                },
                {
                    role: "user",
                    content: `Target Role: ${targetRole}\n\nResume Text: ${extractedText}`
                }
            ],
            max_tokens: 500,
        });

        // 4. Cleanup
        await fs.unlink(file.path).catch(() => {});

        // 5. Success
        const resultText = response.choices[0].message.content;
        console.log("✅ SUCCESS! Response received.");
        res.json({ result: resultText });

    } catch (error) {
        console.error("💥 ERROR DETAILS:", error.message);
        
        if (file?.path) await fs.unlink(file.path).catch(() => {});

        // If the provider fails, send a helpful message to the user
        const isProviderError = error.message.includes("provider") || error.message.includes("500");
        const userMessage = isProviderError 
            ? "The AI server is currently overloaded. Please wait 10 seconds and try again." 
            : error.message;

        res.status(500).json({ error: userMessage });
    }
};