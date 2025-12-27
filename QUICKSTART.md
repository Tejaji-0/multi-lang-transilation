# 🚀 Quick Start Guide

## Get Started in 3 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Your Browser
Navigate to `http://localhost:5173`

## 📖 How to Use

### Upload an Image
1. **Drag & Drop** or **Click** to upload an image with text
2. Supported formats: JPG, PNG, WEBP, GIF

### Extract Text
- OCR automatically starts when you upload an image
- Watch the progress bar for status updates
- Wait for extraction to complete

### Translate
1. **Source Language**: Choose language or use auto-detect
2. **Target Language**: Select from 30+ languages
3. Translation happens automatically

### Actions
- **Copy**: Click copy icon to copy text to clipboard
- **Download**: Download text as .txt file
- **Speak**: Listen to text using text-to-speech
- **Dark Mode**: Toggle dark/light theme

## 🎯 Tips

### For Best OCR Results
- Use high-quality, clear images
- Ensure good lighting and contrast
- Avoid blurry or distorted text
- Position text horizontally

### Supported Languages
- **13 Indian Languages**: Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Bengali, Gujarati, Punjabi, Urdu, Odia, Assamese, Sanskrit
- **17+ Global Languages**: English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Russian, Portuguese, Italian, and more

### Performance
- First load downloads OCR models (~20MB)
- Subsequent uses are faster (cached)
- Translation is instant (uses mock by default)

## 🔧 Configuration

### Add Real Translation API

#### Google Translate
```typescript
// In App.tsx or before first translation
import { translationService } from './services/translationService';

translationService.setApiKey('YOUR_GOOGLE_API_KEY');
```

#### LibreTranslate (Free)
```typescript
translationService.setLibreTranslate();
// Or use custom instance:
translationService.setLibreTranslate('https://your-instance.com/translate');
```

## 🛠️ Development

### Available Commands
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run linter
```

### Project Structure
```
src/
├── components/    # UI components
├── hooks/        # Custom hooks
├── services/     # Business logic
└── App.tsx       # Main app
```

## ❓ Troubleshooting

### OCR Not Working?
- Check internet connection (first load needs models)
- Clear browser cache
- Try different image format
- Ensure image contains visible text

### Translation Not Working?
- App uses mock translation by default
- Add real API key for actual translations
- Check console for errors

### Slow Performance?
- First load downloads OCR models
- Clear browser cache if stuck
- Check browser console for errors

## 🎨 Customization

### Change Accent Color
Edit `tailwind.config.js`:
```javascript
colors: {
  accent: {
    500: '#YOUR_COLOR',
    // ... other shades
  }
}
```

### Add More Languages
Edit `src/services/languages.ts`:
```typescript
export const LANGUAGES: Language[] = [
  { code: 'xx', name: 'Language', nativeName: 'Native', region: 'Region' },
  // ... add more
];
```

## 📚 Learn More

- Read full [README.md](./README.md)
- Check [package.json](./package.json) for dependencies
- Explore [src/](./src) for implementation details

---

**Need help?** Open an issue on GitHub or check the documentation.

**Built with** ❤️ using React, TypeScript, Vite, and Tesseract.js
