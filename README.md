# 🌍 Multi-Language Translation App

A modern, minimalistic web application for extracting text from images and translating it into multiple languages. Built with React, TypeScript, and Tesseract.js.

![Made with React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-cyan)

## ✨ Features

### Core Functionality
- 📤 **Image Upload**: Drag-and-drop or click to upload images (JPG, PNG, WEBP, GIF)
- 🔍 **OCR (Optical Character Recognition)**: Extract text from images using Tesseract.js
- 🌐 **Multi-Language Translation**: Translate to 30+ languages including all major Indian languages
- 📊 **Real-time Progress**: Live OCR progress indicator with status updates
- 🤖 **Language Auto-Detection**: Automatically detect source language from extracted text

### Interactive Features
- 📋 **Copy to Clipboard**: One-click copy for extracted and translated text
- 💾 **Download as Text**: Save translations as .txt files
- 🔊 **Text-to-Speech**: Listen to translations (browser's Speech Synthesis API)
- 🌙 **Dark Mode**: Toggle between light and dark themes with persistent settings
- 🔎 **Searchable Language Selector**: Find languages quickly with search functionality

### UI/UX
- 📱 **Fully Responsive**: Mobile-first design that works on all devices
- 🎨 **Modern, Minimalistic UI**: Clean design with neutral color palette and accent colors
- ✨ **Smooth Animations**: Micro-animations for better user experience
- ♿ **Accessible**: Proper ARIA labels and keyboard navigation support

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Tesseract.js** - Pure JavaScript OCR engine
- **Lucide React** - Beautiful, consistent icons

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/multi-lang-translation.git
cd multi-lang-translation
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🏗️ Project Structure

```
multi-lang-translation/
├── src/
│   ├── components/          # React components
│   │   ├── ImageUploader.tsx    # Drag-and-drop image upload
│   │   ├── LanguageSelector.tsx # Searchable language dropdown
│   │   ├── TextDisplay.tsx      # Text display with actions
│   │   ├── OCRProgress.tsx      # Progress bar component
│   │   └── Alert.tsx            # Alert/notification component
│   ├── hooks/              # Custom React hooks
│   │   ├── useOCR.ts           # OCR logic and state management
│   │   ├── useTranslation.ts   # Translation logic
│   │   ├── useDarkMode.ts      # Dark mode toggle
│   │   └── useSpeech.ts        # Text-to-speech functionality
│   ├── services/           # Business logic
│   │   ├── ocrService.ts       # Tesseract.js wrapper
│   │   ├── translationService.ts # Translation API wrapper
│   │   └── languages.ts        # Language definitions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles and Tailwind
├── public/                # Static assets
├── index.html            # HTML template
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🌐 Supported Languages

### Indian Languages (13)
- 🇮🇳 Hindi (हिन्दी)
- 🇮🇳 Tamil (தமிழ்)
- 🇮🇳 Telugu (తెలుగు)
- 🇮🇳 Kannada (ಕನ್ನಡ)
- 🇮🇳 Malayalam (മലയാളം)
- 🇮🇳 Marathi (मराठी)
- 🇮🇳 Bengali (বাংলা)
- 🇮🇳 Gujarati (ગુજરાતી)
- 🇮🇳 Punjabi (ਪੰਜਾਬੀ)
- 🇮🇳 Urdu (اردو)
- 🇮🇳 Odia (ଓଡ଼ିଆ)
- 🇮🇳 Assamese (অসমীয়া)
- 🇮🇳 Sanskrit (संस्कृतम्)

### Global Languages (17)
English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Russian, Portuguese, Italian, Dutch, Turkish, Polish, Vietnamese, Thai, Indonesian, Malay, Swahili

## 🔧 Configuration

### Translation API Setup

The app includes a mock translation service by default for demo purposes. To use a real translation API:

#### Google Translate API
```typescript
// In your component or App.tsx
import { translationService } from './services/translationService';

translationService.setApiKey('YOUR_GOOGLE_API_KEY');
```

#### LibreTranslate (Free & Open Source)
```typescript
// Use public LibreTranslate instance
translationService.setLibreTranslate();

// Or use your own instance
translationService.setLibreTranslate('https://your-instance.com/translate');
```

### OCR Language Configuration

To change the default OCR language, modify the `OCR_LANGUAGES` array in `src/services/languages.ts`:

```typescript
export const OCR_LANGUAGES = [
  'eng', 'hin', 'tam', 'tel', 'kan', 'mal', 'mar', 'ben', 'guj', 'pan', 'ori', 'asm',
  'spa', 'fra', 'deu', 'chi_sim', 'jpn', 'kor', 'ara', 'rus', 'por', 'ita'
];
```

## 📝 Usage Guide

1. **Upload an Image**
   - Click the upload area or drag and drop an image
   - Supports JPG, PNG, WEBP, and GIF formats
   
2. **Wait for OCR Processing**
   - The app will automatically extract text from the image
   - Watch the progress bar for status updates
   
3. **Select Languages**
   - Choose source language (or use auto-detect)
   - Select target language from the dropdown
   - Use search to find languages quickly
   
4. **View Results**
   - Original image, extracted text, and translation shown side-by-side
   - Three-column layout for easy comparison
   
5. **Use Action Buttons**
   - **Copy**: Copy text to clipboard
   - **Download**: Save as .txt file
   - **Speak**: Listen to text using text-to-speech

## 🎨 Key Features in Detail

### 📸 Image Upload
- **Drag & Drop**: Intuitive drag-and-drop interface
- **Visual Feedback**: Hover states and animations
- **Image Preview**: See uploaded image before processing
- **Clear Option**: Remove image to start over

### 🔍 OCR Processing
- **Real-time Progress**: Live progress bar with status messages
- **Multi-language Support**: 20+ OCR languages
- **High Accuracy**: Powered by Tesseract.js
- **Format Support**: JPG, PNG, WEBP, GIF

### 🌐 Translation
- **Auto-detection**: Automatically detect source language
- **30+ Languages**: Including all major Indian languages
- **Searchable Dropdown**: Quick language search
- **Real-time Translation**: Instant translation updates

### 🎯 User Experience
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Smooth Animations**: Fade-in, slide-up, and scale effects
- **Accessible**: ARIA labels and keyboard navigation

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Tech Decisions

**Why Vite?**
- Lightning-fast hot module replacement
- Optimized build output
- Better developer experience

**Why Tesseract.js?**
- Pure JavaScript OCR
- No backend required
- Wide language support
- Good accuracy

**Why Tailwind CSS?**
- Rapid development
- Consistent design system
- Small production bundle
- Easy customization

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload the 'dist' folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Deploy the 'dist' folder
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Tesseract.js](https://tesseract.projectnaptha.com/) for OCR functionality
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for build tooling

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Made with ❤️ using React, TypeScript, and Vite
- Instant translation updates

### User Experience
- Smooth animations and transitions
- Dark mode with persistent preference
- Responsive mobile-first design
- Accessible fonts and spacing
- Error handling with friendly messages

## 🛠️ Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder, ready to deploy to any static hosting service.

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Tesseract.js for OCR capabilities
- Tailwind CSS for styling
- Lucide for beautiful icons
