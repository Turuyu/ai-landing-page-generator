# AI Landing Page Generator

A modern landing page generator built with Next.js 14, featuring a dark-themed editor UI and beautiful glassmorphism templates that support theming, custom primary colors, and Google Fonts.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)

## Features

- **Markdown DSL**: Define landing pages using a simple Markdown-based domain-specific language
- **Real-time Preview**: See changes instantly in the built-in preview panel
- **Theme Support**: Light/Dark themes with automatic adaptation
- **Custom Primary Color**: Pick any color for accents, buttons, and gradients
- **Google Fonts**: Outfit, Space Grotesk, Syne, Clash Display, Inter, and more
- **Glassmorphism Designs**: Modern UI with blur effects, gradients, and animations
- **ZIP Export**: Download your landing page as a standalone HTML file
- **Accordion Editor**: Collapsible sections for organize your workflow

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Turuyu/ai-landing-page-generator
cd ai-landing-page-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000/editor](http://localhost:3000/editor) in your browser.

## Architecture

```
app/
├── editor/page.tsx          # Main editor UI
├── api/generate/route.ts   # POST /api/generate
└── globals.css           # Dark theme variables

lib/
├── parser/              # Markdown → AST pipeline
│   ├── parseMarkdown.ts
│   ├── sectionExtractor.ts
│   └── mapper.ts
├── ast/                # Zod validation schemas
├── generator/         # Handlebars → HTML
│   ├── renderHTML.ts
│   └── templateEngine.ts
└── exporter/          # ZIP export

templates/sections/    # Handlebars templates
├── hero.hbs
├── features.hbs
├── cta.hbs
└── contact.hbs
```

## DSL Syntax

```markdown
# Hero
headline: Welcome to Our Product
subheadline: The best solution for your business
ctaText: Get Started
ctaLink: #signup

---

# Features
title: Our Features
features:
  - Feature 1
  - Feature 2
  - Feature 3
feature0desc: First feature description
feature1desc: Second feature description
feature2desc: Third feature description

---

# CTA
headline: Ready to Get Started?
description: Join thousands of satisfied customers
buttonText: Sign Up Now
buttonLink: #signup

---

# Contact
title: Contact Us
email: hello@example.com
phone: +1 (555) 123-4567
address: 123 Business St, San Francisco, CA
```

## API

**POST** `/api/generate`

```json
{
  "formData": {
    "title": "My Landing Page",
    "theme": "dark",
    "primaryColor": "#00d4ff",
    "font": "Outfit"
  },
  "markdown": "# Hero\nheadline: Hello..."
}
```

Response:
```json
{
  "html": "<!DOCTYPE html>...",
  "ast": { "meta": {...}, "sections": [...] }
}
```

## Tech Stack

- **Next.js 14** - App Router, API routes
- **React 18** - Client components
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility classes
- **Zod** - Schema validation
- **Handlebars** - Template engine
- **Remark** - Markdown parsing
- **JSZip** - File export

## License

MIT © [Luis Toraya](https://github.com/Turuyu)