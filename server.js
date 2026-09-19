import express from "express";
import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel
} from "@qvac/sdk";

const app = express();
const PORT = 3000;

app.use(express.json());

let modelId;

const html = `
<!DOCTYPE html>
<html>
<head>
  <title>QVAC Local AI Assistant</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
    }
    h1 {
      text-align: center;
    }
    .status {
      padding: 12px;
      background: #eee;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    textarea {
      width: 100%;
      height: 120px;
      padding: 10px;
      font-size: 16px;
      box-sizing: border-box;
    }
    button {
      margin-top: 10px;
      padding: 12px 20px;
      font-size: 16px;
      cursor: pointer;
    }
    #answer {
      margin-top: 20px;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 8px;
      white-space: pre-wrap;
      min-height: 50px;
    }
  </style>
</head>
<body>

  <h1>QVAC Local AI Assistant</h1>

  <div class="status">
    ✓ QVAC AI running locally on this computer
  </div>

  <textarea id="question" placeholder="Ask a question..."></textarea>
  <br>
  <button onclick="askAI()">Ask QVAC</button>

  <div id="answer">AI answer will appear here.</div>

  <script>
    async function askAI() {
      const question = document.getElementById("question").value;
      const answer = document.getElementById("answer");

      if (!question.trim()) {
        answer.textContent = "Please enter a question.";
        return;
      }

      answer.textContent = "QVAC is thinking...";

      try {
        const response = await fetch("/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ question })
        });

        const data = await response.json();
        answer.textContent = data.answer || data.error;
      } catch (error) {
        answer.textContent = "Error connecting to QVAC.";
      }
    }
  </script>

</body>
</html>
`;

app.get("/", (req, res) => {
  res.send(html);
});

app.post("/ask", async (req, res) => {
  try {
    const question = req.body.question;

    const history = [
      {
        role: "user",
        content: question
      }
    ];

    const result = completion({
      modelId,
      history,
      stream: true
    });

    let answer = "";

    for await (const token of result.tokenStream) {
      answer += token;
    }

    res.json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "QVAC could not generate a response."
    });
  }
});

async function startServer() {
  console.log("======================================");
  console.log("        QVAC LOCAL AI WEB APP");
  console.log("======================================");
  console.log("Loading QVAC model...");

  modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0
  });

  console.log("✓ QVAC model loaded successfully!");
  console.log("✓ Inference mode: ON-DEVICE / LOCAL");

  app.listen(PORT, () => {
    console.log(`✓ Web app running at http://localhost:${PORT}`);
  });
}

startServer();

process.on("SIGINT", async () => {
  console.log("\\nUnloading QVAC model...");
  if (modelId) {
    await unloadModel({ modelId });
  }
  process.exit(0);
});