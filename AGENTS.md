# AGENTS.md

## Status: ✅ COMPLETE

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000/editor)
npm run build   # Build production
npm run lint   # Lint (requires config setup)
```

## Architecture

**Tech Stack:** Next.js 14 (App Router), React 18, Tailwind CSS, Zod, remark, Handlebars, JSZip

**Entry Points:**
- `/app/editor/page.tsx` - Main editor UI (editor loads here by default)
- `/app/api/generate/route.ts` - POST /api/generate

**Key Directories:**
- `/lib/parser/` - Markdown → AST pipeline
- `/lib/ast/` - Zod validation schemas
- `/lib/generator/` - Handlebars → HTML rendering
- `/lib/exporter/` - ZIP export
- `/templates/sections/` - Per-section .hbs templates
- `/types/ast.ts` - TypeScript type definitions

**Processing Flow:**
```
Form + Markdown DSL → /api/generate → Extract → Map → Validate → Render → HTML
```

## Core Rules

1. **Never** render directly from Markdown - always validate AST first
2. **Each** section = independent `.hbs` template in `/templates/sections/`
3. **No** hardcoded HTML in business logic
4. **Mapping** logic centralized in `/lib/parser/mapper.ts`
5. **DSL pattern:** `# SectionName` + `---` separators for section extraction

## DSL Syntax

```markdown
# Hero
headline: Welcome
subheadline: Description
ctaText: Get Started
ctaLink: #signup

---

# Features
title: Our Features
(features piped list)
feature0desc: First feature
feature1desc: Second feature

---

# CTA
headline: Ready?
buttonText: Sign Up
buttonLink: #signup

---

# Contact
title: Contact Us
email: hello@example.com
phone: +1 555 123 4567
address: 123 Main St
```

## API Contract

**POST** `/api/generate`

Input: `{ formData: object, markdown: string }`
Output: `{ html: string, ast: AST }`

## Build Notes

- Build passes with warnings about Handlebars `require.extensions` (non-critical)
- ESLint requires initial config setup (run `npm run lint` and choose options)