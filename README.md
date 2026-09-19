# QVAC Local AI Assistant

A simple local AI assistant powered by Tether's QVAC SDK.

The application runs an AI language model directly on the user's computer. It does not require an API key or a cloud AI service for inference.

## Features

- Local AI inference
- Interactive command-line chat
- No API key required
- No cloud AI API required
- Uses Tether's open-source QVAC SDK

## QVAC SDK

This project uses:

@qvac/sdk version 0.19.1

QVAC functions used:

- loadModel() - loads the AI model locally
- completion() - generates AI responses locally
- unloadModel() - unloads the model when the application exits

## Requirements

- Node.js
- npm
- A computer capable of running the QVAC model

## Installation

Clone the repository:

    git clone https://github.com/danieldumanglas-lab/qvac-local-ai.git

Enter the project directory:

    cd qvac-local-ai

Install the dependencies:

    npm install

## Run

Start the application with:

    npm start

The first run downloads the required QVAC model.

After the model loads, type a question at the You > prompt.

Type:

    exit

to close the application.

## Example

    QVAC LOCAL AI ASSISTANT

    AI inference runs locally on this computer.
    No API key or cloud AI service is used.

    Loading QVAC model...
    QVAC model loaded successfully!

    You > What is civil engineering?

    QVAC >
    Civil engineering is the application of engineering principles...

## How It Works

The application uses QVAC to load a local Llama model and generate responses directly on the device.

The main flow is:

1. loadModel() loads the local model.
2. completion() processes the user's question and generates the response.
3. unloadModel() releases the model when the application exits.

No external cloud AI service is used for the inference performed by this application.

Web Interface

A browser-based interface is also included for interacting with the local QVAC AI model.

Start the web application with:

node server.js

Then open:

http://localhost:3000

The web interface uses QVAC for local on-device inference. It uses loadModel() to load the AI model and completion() to generate responses locally. No cloud AI API is used for inference.

## License

This project is licensed under the MIT License.

## Project Status

This project is a working demonstration of on-device AI inference using Tether's QVAC SDK.

The application has been tested locally with QVAC SDK version 0.19.1.