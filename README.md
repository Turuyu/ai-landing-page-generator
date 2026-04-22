# AI Landing Page Generator

Un generador moderno de landing pages construido con Next.js 14, equipado con IA para generar páginas a partir de descripciones en lenguaje natural.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)

## Características

- **Generación con IA**: Describe tu proyecto y la IA crea tu landing page automáticamente
- **Markdown DSL**: Define landing pages usando un lenguaje simplificado basado en Markdown
- **Vista Previa en Tiempo Real**: Ve los cambios instantáneamente en el panel de vista previa
- **Soporte de Temas**: Temas claros/oscuros con adaptación automática
- **Color Primary Personalizable**: Elige cualquier color para acentos, botones y gradientes
- **Google Fonts**: Outfit, Space Grotesk, Syne, Clash Display, Inter y más
- **Diseños Glassmorphism**: UI moderna con efectos blur, gradientes y animaciones
- **Exportación ZIP**: Descarga tu landing page como archivo HTML independiente
- **Editor Acordeón**: Secciones colapsables para organizar tu flujo de trabajo
- **Subida de Archivos**: Importa archivos .md con tu diseño personalizado
- **10 Categorías**: SaaS, Restaurant, Portfolio, Ecommerce, Lead Magnet, Course, App, Service, Event y Generic

## Requisitos

### Necesario para Modo IA

Para usar la generación con inteligencia artificial, necesitas:

1. **Obtener una API Key de OpenAI**:
   - Visita [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Crea una cuenta o inicia sesión
   - Genera una nueva API Key

2. **Configurar la variable de entorno**:
   ```bash
   # Copia el archivo de ejemplo
   cp .env.example .env.local
   
   # Edita y añade tu API key
   # OPENAI_API_KEY=sk-tu-api-key-aqui
   ```

### Costos_estimados

- **gpt-4o-mini**: ~$0.002-0.01 por landing page generado
- Costo muy bajo para desarrollo y uso personal

## Primeros Pasos

```bash
# Clonar el repositorio
git clone https://github.com/Turuyu/ai-landing-page-generator
cd ai-landing-page-generator

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000/editor](http://localhost:3000/editor) en tu navegador.

## Cómo Usar

### Modo Chat IA (Recomendado)

1. Selecciona el modo **"Chat AI"** en el editor
2. Describe tu proyecto en lenguaje natural
   - Ejemplo: "Landing page para un restaurante italiano llamado La Trattoria. Necesito mostrar el menú, reservas y horarios."
3. También puedes subir un archivo `.md` con tu diseño
4. Click en **"Generate with AI"**
5. La IA analizará tu descripción y generará el contenido
6. Personaliza en el editor Markdown si es necesario
7. Click en **"Generate Preview"** para ver el resultado

### Modo Manual

1. Selecciona el modo **"Manual"**
2. Completa los campos del formulario
3. O edita directamente el Markdown DSL
4. Click en **"Generate Preview"**

## Arquitectura

```
app/
├── editor/page.tsx          # UI principal del editor
├── api/generate/route.ts   # POST /api/generate
├── api/analyze/route.ts     # POST /api/analyze (IA)
└── globals.css            # Variables de tema oscuro

lib/
├── parser/                # Pipeline Markdown → AST
│   ├── parseMarkdown.ts
│   ├── sectionExtractor.ts
│   └── mapper.ts
├── ast/                 # Esquemas Zod
├── generator/            # Handlebars → HTML
│   ├── renderHTML.ts
│   └── templateEngine.ts
├── ai/                  # Módulo de IA
│   ���── prompts.ts        # Plantillas de prompts
│   └── analyzer.ts     # Lógica de análisis
└── exporter/           # Exportación ZIP

templates/sections/      # Plantillas Handlebars
├── hero.hbs
├── features.hbs
├── cta.hbs
└── contact.hbs
```

## Sintaxis DSL

```markdown
# Hero
headline: Bienvenido a Nuestro Producto
subheadline: La mejor solución para tu negocio
ctaText: Empezar
ctaLink: #signup

---

# Features
title: Nuestras Características
features:
  - Característica 1
  - Característica 2
  - Característica 3
feature0desc: Primera descripción
feature1desc: Segunda descripción
feature2desc: Tercera descripción

---

# CTA
headline: ¿Listo para empezar?
description: Únete a miles de clientes satisfechos
buttonText: Regístrate Ahora
buttonLink: #signup

---

# Contact
title: Contáctanos
email: hola@ejemplo.com
phone: +1 (555) 123-4567
address: Calle Principal 123, Ciudad
```

## API

### POST `/api/generate`

Genera HTML desde Markdown DSL.

```json
{
  "formData": {
    "title": "Mi Landing Page",
    "theme": "dark",
    "primaryColor": "#00d4ff",
    "font": "Outfit"
  },
  "markdown": "# Hero\nheadline: Hola..."
}
```

Respuesta:
```json
{
  "html": "<!DOCTYPE html>...",
  "ast": { "meta": {...}, "sections": [...] }
}
```

### POST `/api/analyze` (IA)

Genera contenido Markdown a partir de una descripción.

```json
{
  "description": "Landing page para restaurante italiano",
  "action": "analyze"
}
```

Respuesta:
```json
{
  "markdown": "# Hero\nheadline: ...", // DSL generado
  "category": "restaurant",         // Categoría detectada
  "categoryName": "Restaurant / Food",
  "confidence": 0.9,
  "suggestions": ["Actualiza el email..."],
  "fallback": false
}
```

## Tech Stack

- **Next.js 14** - App Router, API routes
- **React 18** - Componentes cliente
- **TypeScript** - Seguridad de tipos
- **Tailwind CSS** - Clases utilitarias
- **Zod** - Validación de esquemas
- **Handlebars** - Motor de plantillas
- **OpenAI** - Generación con IA
- **JSZip** - Exportación de archivos

## Licencia

MIT © [Luis Toraya](https://github.com/Turuyu)