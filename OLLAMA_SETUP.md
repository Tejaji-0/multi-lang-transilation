# Ollama Setup Guide

## What is Ollama?

Ollama is a powerful tool that allows you to run large language models (LLMs) and vision models locally on your machine. This app uses Ollama's vision model (llava) for superior text extraction and translation accuracy.

## Installation Steps

### 1. Install Ollama

**Windows:**
- Download from: https://ollama.com/download/windows
- Run the installer
- Ollama will start automatically

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Start Ollama Service

The Ollama service should start automatically. If not:

**Windows:** 
- Ollama runs as a background service automatically

**macOS/Linux:**
```bash
ollama serve
```

### 3. Pull Required Models

Open a terminal/command prompt and run:

```bash
# Pull the vision model (for text extraction from images)
ollama pull llava:latest

# Pull the text model (for translation)
ollama pull llama3.2:latest
```

**Note:** The first pull will download ~4GB for llava and ~2GB for llama3.2. This is a one-time download.

### 4. Verify Installation

Check if models are installed:

```bash
ollama list
```

You should see:
```
NAME              ID              SIZE
llava:latest      xxx             4.7GB
llama3.2:latest   xxx             2.0GB
```

### 5. Test Ollama

Test if Ollama is working:

```bash
ollama run llava
```

Then try describing an image or press Ctrl+D to exit.

## Using with the App

Once Ollama is set up:

1. The app will automatically detect Ollama running on `http://localhost:11434`
2. You'll see a green banner: "✨ Using Ollama Vision AI (llava)"
3. Upload an image and watch it extract text with high accuracy
4. Translation will be done using Ollama's LLM for better quality

## Benefits of Using Ollama

✅ **Better Accuracy**: Vision models understand context and layout better than traditional OCR
✅ **Handles Complex Text**: Works with stylized fonts, curved text, overlapping text
✅ **Multi-language**: Recognizes text in 100+ languages
✅ **Signs & Symbols**: Accurately extracts @, #, $, %, numbers, etc.
✅ **Privacy**: Everything runs locally on your machine
✅ **Free**: No API keys or usage limits

## Fallback Mode

If Ollama is not available, the app automatically falls back to:
- **Tesseract.js** for text extraction (browser-based OCR)
- **MyMemory API** for translation (free online API)

## Troubleshooting

### "Ollama not detected"
- Make sure Ollama is installed and running
- Check if you can access http://localhost:11434 in your browser
- Restart the Ollama service

### "Model not found"
- Run `ollama pull llava` to download the vision model
- Run `ollama pull llama3.2` to download the text model

### Slow Performance
- First run is slower as models load into memory
- Subsequent requests are much faster
- Consider using a GPU for better performance

### Port Conflicts
- Ollama uses port 11434 by default
- Change the port in Ollama settings if needed

## Alternative Models

You can use different models by modifying `ollamaService.ts`:

```typescript
// Smaller/faster models
ollamaService.setModels('llava:7b', 'llama3.2:1b');

// Larger/better models  
ollamaService.setModels('llava:34b', 'llama3.2:70b');
```

## System Requirements

- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 10GB free space for models
- **GPU**: Optional but improves performance significantly
- **OS**: Windows 10+, macOS 12+, or Linux

## More Information

- Ollama Documentation: https://github.com/ollama/ollama
- Llava Model: https://ollama.com/library/llava
- Model Library: https://ollama.com/library
