import Handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'

const TEMPLATES_DIR = path.join(process.cwd(), 'templates', 'sections')

const templateCache: Map<string, HandlebarsTemplateDelegate> = new Map()

function rgbFromHex(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '0, 212, 255'
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
}

Handlebars.registerHelper('primaryRgb', function(hex) {
  return rgbFromHex(hex || '#00d4ff')
})

Handlebars.registerHelper('multiply', function(index: number, multiplier: number) {
  return index * multiplier
})

export function loadTemplate(sectionType: string): HandlebarsTemplateDelegate {
  if (templateCache.has(sectionType)) {
    return templateCache.get(sectionType)!
  }
  
  const templatePath = path.join(TEMPLATES_DIR, `${sectionType}.hbs`)
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${sectionType}`)
  }
  
  const templateContent = fs.readFileSync(templatePath, 'utf-8')
  const template = Handlebars.compile(templateContent)
  
  templateCache.set(sectionType, template)
  
  return template
}

export function renderSection(section: any): string {
  const template = loadTemplate(section.type)
  const meta = section.meta || {}
  const data = {
    ...section.data,
    meta,
    primaryColor: meta.primaryColor || '#00d4ff',
    primaryRgb: rgbFromHex(meta.primaryColor || '#00d4ff'),
    theme: meta.theme || 'light',
    font: meta.font || 'Outfit'
  }
  return template(data)
}