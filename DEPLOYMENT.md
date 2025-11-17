# Deployment Guide - Vercel

This guide will help you deploy the Image Playground app to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier works)
2. [Anthropic API key](https://console.anthropic.com/)
3. [Google Generative AI API key](https://makersuite.google.com/app/apikey)

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**

   In the Vercel project settings, add these environment variables:

   | Variable Name | Value | Notes |
   |--------------|-------|-------|
   | `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | From Anthropic Console |
   | `GOOGLE_GENERATIVE_AI_API_KEY` | `AIza...` | From Google AI Studio |
   | `GOOGLE_API_KEY` | `AIza...` | Same as above |
   | `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Your Vercel URL |

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Visit your live app!

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

   Follow the prompts and add environment variables when asked.

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Environment Variables Setup

After deployment, go to your project settings on Vercel:

1. Navigate to **Settings** → **Environment Variables**
2. Add each variable from `.env.example`
3. Set the environment (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** for changes to take effect

## Post-Deployment

### Update NEXT_PUBLIC_APP_URL

After deployment, update the `NEXT_PUBLIC_APP_URL` environment variable with your actual Vercel URL:

1. Copy your deployment URL (e.g., `https://image-playground-nextjs.vercel.app`)
2. Update `NEXT_PUBLIC_APP_URL` in Vercel settings
3. Redeploy

### Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to match your custom domain

## Troubleshooting

### Build Fails

- **Check environment variables**: Ensure all API keys are set correctly
- **Check build logs**: Look for specific error messages in Vercel dashboard
- **Local build test**: Run `npm run build` locally to catch issues early

### API Keys Not Working

- Ensure variables are set in **Production** environment
- Redeploy after adding environment variables
- Check API key format and validity

### TypeScript/ESLint Errors

The project is configured to allow builds with TypeScript/ESLint warnings:
- `ignoreBuildErrors: true` in `next.config.ts`
- This is intentional for development flexibility

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

Every push triggers a new deployment!

## Performance Optimization

The app is already optimized with:
- ✅ Turbopack for faster builds
- ✅ Image optimization via Next.js
- ✅ API route caching
- ✅ Modular architecture for code splitting

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Support](https://vercel.com/support)

---

**Bundle Size**: ~314 kB (optimized)
**Build Time**: ~2-3 minutes
**Deployment Region**: US East (default)
