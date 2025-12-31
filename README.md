# 🚀 AI Portfolio Generator

An AI-powered portfolio generator that creates and deploys stunning developer portfolios using **Contentstack Headless CMS** and **Contentstack Launch**.

## ✨ Features

- **GitHub Integration**: Fetches your profile, repositories, and contribution data
- **AI-Powered Content**: Uses GPT-4 to generate compelling portfolio copy
- **Automatic Deployment**: Deploys to Contentstack Launch with one click
- **Content Management**: Edit your portfolio anytime via Contentstack CMS
- **Beautiful UI**: Modern, responsive design with dark mode

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          SYSTEM FLOW                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  User Input ──▶ GitHub API ──▶ AI Generation ──▶ Contentstack ──▶ Launch │
│                                                                          │
│  1. Enter name & GitHub URL                                              │
│  2. Fetch repositories & profile                                         │
│  3. Generate portfolio content with AI                                   │
│  4. Create entries in Contentstack                                       │
│  5. Deploy to Contentstack Launch                                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Contentstack Account** with:
   - A Stack created
   - Management Token generated
   - Delivery Token generated
   - Contentstack Launch project set up

2. **OpenAI API Key** from [platform.openai.com](https://platform.openai.com)

3. **GitHub Personal Access Token** (optional, for higher rate limits)

4. **Node.js 18+** installed

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd ai-portfolio-generator
npm install
```

### 2. Set Up Environment Variables

Copy `env.example.txt` to `.env.local`:

```bash
cp env.example.txt .env.local
```

Edit `.env.local` with your credentials:

```env
# Contentstack
CONTENTSTACK_API_KEY=your_api_key
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
CONTENTSTACK_MANAGEMENT_TOKEN=your_management_token
CONTENTSTACK_ENVIRONMENT=development
CONTENTSTACK_REGION=us

# OpenAI
OPENAI_API_KEY=sk-your_key

# GitHub (optional)
GITHUB_TOKEN=ghp_your_token
```

### 3. Set Up Contentstack Content Type

Import the content type schema into your Contentstack stack:

1. Go to your Stack > Content Models
2. Click "Import Content Type"
3. Upload `contentstack/content-types/portfolio.json`

### 4. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ai-portfolio-generator/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/       # API endpoint for generation
│   │   ├── page.tsx            # Main UI
│   │   └── layout.tsx          # App layout
│   ├── components/
│   │   ├── PortfolioForm.tsx   # Input form
│   │   ├── PreviewPane.tsx     # Content preview
│   │   └── DeploymentStatus.tsx # Success screen
│   └── lib/
│       ├── contentstack/
│       │   ├── config.ts       # Contentstack config
│       │   ├── management.ts   # Management API client
│       │   └── launch.ts       # Launch integration
│       ├── github/
│       │   └── fetcher.ts      # GitHub API client
│       ├── ai/
│       │   └── content-generator.ts # AI content generation
│       └── portfolio-generator.ts   # Main orchestrator
├── contentstack/
│   └── content-types/
│       └── portfolio.json      # Content type schema
└── package.json
```

## 🔧 Contentstack Setup Guide

### Step 1: Create a Stack

1. Log into [Contentstack](https://app.contentstack.com)
2. Click "Create New Stack"
3. Name it "Portfolio Generator"

### Step 2: Generate Tokens

1. Go to Settings > Tokens
2. Create a **Management Token** with full access
3. Create a **Delivery Token** for your environment

### Step 3: Import Content Type

1. Go to Content Models
2. Import `contentstack/content-types/portfolio.json`

### Step 4: Set Up Contentstack Launch

1. Go to Launch in the sidebar
2. Click "Create new project"
3. Connect your portfolio frontend repository
4. Configure build settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output: `.next`

### Step 5: Configure Webhook (Optional)

For automatic deployments on content publish:

1. Go to Settings > Webhooks
2. Create a new webhook:
   - Name: "Deploy on Publish"
   - URL: Your Launch webhook URL
   - Trigger: Entry > Publish
   - Content Type: portfolio

## 🎨 Customization

### Portfolio Styles

The generator supports 4 portfolio styles:
- `minimal` - Clean, whitespace-focused
- `modern` - Bold with gradients
- `creative` - Unique layouts and animations
- `professional` - Corporate, polished

### Color Schemes

- `light` - Light backgrounds
- `dark` - Dark mode
- `colorful` - Vibrant accents

### Extending the Content Type

Add new fields in `contentstack/content-types/portfolio.json`:

```json
{
  "display_name": "Your Field",
  "uid": "your_field",
  "data_type": "text"
}
```

Then update `src/lib/portfolio-generator.ts` to include the new field.

## 🔌 API Reference

### POST /api/generate

Generate a portfolio (preview or deploy).

**Request Body:**

```json
{
  "fullName": "John Doe",
  "githubUrl": "https://github.com/johndoe",
  "email": "john@example.com",
  "currentRole": "Senior Developer",
  "company": "Contentstack",
  "portfolioStyle": "modern",
  "colorScheme": "dark",
  "mode": "preview"  // or "deploy"
}
```

**Response (Preview):**

```json
{
  "success": true,
  "mode": "preview",
  "data": {
    "githubProfile": { ... },
    "repositories": [ ... ],
    "generatedContent": { ... }
  }
}
```

**Response (Deploy):**

```json
{
  "success": true,
  "mode": "deploy",
  "data": {
    "portfolioUrl": "https://...",
    "entryUid": "blt...",
    "deploymentId": "deploy-..."
  }
}
```

## 🚀 Deployment

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Contentstack Launch

1. Push to GitHub
2. Connect repo to Launch
3. Configure environment variables in Launch settings
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this for your own projects!

---

Built with ❤️ using [Contentstack](https://contentstack.com) + [Next.js](https://nextjs.org) + [OpenAI](https://openai.com)

