import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel
} from "@qvac/sdk";

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

let modelId;

try {
  console.log("======================================");
  console.log("        QVAC LOCAL AI ASSISTANT");
  console.log("======================================");
  console.log("AI inference runs locally on this computer.");
  console.log("No API key or cloud AI service is used.\n");

  console.log("Loading QVAC model...");

  modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0
  });

  console.log("✓ QVAC model loaded successfully!\n");
  console.log("Ask a question below.");
  console.log("Type 'exit' to quit.\n");

  while (true) {
    const question = (await rl.question("You > ")).trim();

    if (!question) {
      continue;
    }

    if (question.toLowerCase() === "exit") {
      break;
    }

    const history = [
      {
        role: "user",
        content: question
      }
    ];

    console.log("\nQVAC > ");

    const result = completion({
      modelId,
      history,
      stream: true
    });

    for await (const token of result.tokenStream) {
      process.stdout.write(token);
    }

    console.log("\n");
  }
} catch (error) {
  console.error("\nQVAC error:");
  console.error(error);
} finally {
  if (modelId) {
    await unloadModel({ modelId });
  }

  rl.close();

  console.log("\nQVAC model unloaded.");
  console.log("Goodbye!");
}