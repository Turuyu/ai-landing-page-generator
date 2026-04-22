import { AST } from '@/types/ast'
import { renderSection } from './templateEngine'

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 212, 255'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

export function renderHTML(ast: AST): string {
  const sectionsHTML = ast.sections.map(section => renderSection(section)).join('\n')
  
  const primaryColor = ast.meta.primaryColor || '#00d4ff'
  const primaryRgb = hexToRgb(primaryColor)
  const font = ast.meta.font || 'Outfit'
  const theme = ast.meta.theme || 'light'
  
  const isDark = theme === 'dark'
  const textColor = isDark ? '#f0f0f5' : '#1a1a2e'
  const bgColor = isDark ? '#0a0a0e' : '#ffffff'
  const mutedColor = isDark ? '#a0a0b0' : '#6b7280'
  
  const fontImport = `
  <link href="https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  `
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${ast.meta.title || 'Landing Page'}</title>
  ${fontImport}
  <meta name="description" content="Generated landing page">
  <style>
    :root {
      --primary: ${primaryColor};
      --primary-rgb: ${primaryRgb};
      --text: ${textColor};
      --text-muted: ${mutedColor};
      --bg: ${bgColor};
      --font: '${font}', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html {
      scroll-behavior: smooth;
    }
    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(${primaryRgb}, 0.3); }
      50% { box-shadow: 0 0 40px rgba(${primaryRgb}, 0.6); }
    }
  </style>
</head>
<body style="background: var(--bg); color: var(--text);">
  ${sectionsHTML}
</body>
</html>
`.trim()
  
  return html
}