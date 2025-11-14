# 🎨 Image Playground - Next.js

A stunning Next.js application that transforms visual inspiration into creative ideas using AI-powered color analysis and generation.

## ✨ Features

- **AI-Powered Color Extraction**: Uses Anthropic Claude to analyze images and extract meaningful color palettes
- **Creative Domain Specialists**: Generate ideas for Cooking, Fashion, Interior Design, Art/Craft, Makeup, Events, and Graphic Design
- **Advanced Image Generation**: Powered by Google's Gemini 2.5 Flash Image model (Nano Banana)
- **Beautiful UI**: Modern design with shadcn/ui components, smooth animations with Framer Motion
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🚀 Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Animations**: Framer Motion for fluid interactions
- **AI Text Processing**: Anthropic Claude API
- **AI Image Generation**: Google Gemini (Nano Banana) API
- **File Upload**: React Dropzone for drag & drop

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory and add your API keys:

```bash
# Required API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_gemini_api_key_here

# App Configuration (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Get Your API Keys

#### Anthropic API Key
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env.local` file

#### Google Gemini API Key
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env.local` file

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 How to Use

1. **Upload an Image**: Drag & drop an image or paste an image URL
2. **Extract Palette**: Choose the number of colors and extract the color palette
3. **Choose Creative Path**: Select from 7 different creative domains
4. **Select Image Style**: Pick the type of image you want generated
5. **Generate Ideas**: Click generate to get AI-powered creative ideas and images

## 🎯 Creative Domains

- **🍽️ Cooking**: Generate dish concepts, ingredients, and plating ideas
- **👗 Fashion**: Create outfit concepts and styling suggestions
- **🛋️ Interior Design**: Design room concepts and decoration ideas
- **🎨 Art/Craft**: Generate artistic project ideas and techniques
- **💄 Makeup**: Create makeup looks and beauty concepts
- **🎉 Event Theme**: Design event themes and decoration concepts
- **🌐 Graphic/Web Design**: Generate design concepts and visual ideas

## 🔧 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── extract-palette/     # Anthropic color extraction API
│   │   └── generate-ideas/      # Creative ideas generation API
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main application page
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── ColorPalette.tsx         # Color palette display component
│   └── ImageUpload.tsx          # Image upload with drag & drop
└── lib/
    ├── anthropic.ts             # Anthropic API integration
    ├── gemini.ts                # Gemini image generation
    ├── agents.ts                # Creative domain agents
    └── utils.ts                 # Utility functions
```

## 🔄 Comparison with Original Streamlit Version

### Improvements
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Better Performance**: Client-side rendering with Next.js optimizations
- **Enhanced UX**: Drag & drop file upload, real-time progress indicators
- **API Upgrades**: Anthropic Claude instead of OpenAI for text, Gemini instead of DALL-E for images
- **Type Safety**: Full TypeScript implementation
- **Mobile Optimized**: Responsive design that works on all devices

### Key Differences
- **Anthropic Claude**: More sophisticated color analysis and creative text generation
- **Gemini (Nano Banana)**: Advanced image generation with better prompt understanding
- **Next.js Architecture**: Better performance and SEO capabilities
- **Component-Based**: Modular, reusable UI components

## 🧪 Testing

To test the application:

1. Start the development server
2. Upload a test image (try a colorful photo)
3. Extract the color palette
4. Choose a creative path (Cooking is recommended for first test)
5. Select an image style
6. Generate ideas and verify both text and image generation work

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Google Cloud Run

## 📝 License

MIT License - Feel free to use this project for your portfolio or further development!

## 🤝 Contributing

This project demonstrates modern AI integration patterns. Feel free to:
- Add new creative domains
- Enhance existing agent capabilities
- Improve the user interface
- Add new image processing features

## 📞 Support

If you encounter any issues:
1. Check that your API keys are correctly set
2. Verify your internet connection for API calls
3. Check the browser console for error messages
4. Ensure you have sufficient API credits for both services

---

**Built with ❤️ using Next.js, Anthropic Claude, and Google Gemini**
