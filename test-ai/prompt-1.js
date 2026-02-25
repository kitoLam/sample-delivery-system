const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyC6RTxqWNsP-8Z4s8DCV17q1Z60K0dCDPc");
const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

async function run() {
  const prompt = "Viết một đoạn code Hello world bằng C++ theo định dạng markdown, không cần giải thích ";
  const result = await model.generateContent(prompt);
  console.log(result.response.text());
}

run();