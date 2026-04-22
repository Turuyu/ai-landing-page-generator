import OpenAI from 'openai'
import { detectCategory, getSystemPrompt, getAnalysisPrompt, Category, promptTemplates } from './prompts'

const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY
  if (!apiKey) {
    throw new Error('Missing credentials. Please pass an `apiKey`, `workloadIdentity`, or set the `OPENAI_API_KEY` environment variable.')
  }
  return new OpenAI({ apiKey })
}

export interface AnalysisResult {
  markdown: string
  category: Category
  categoryName: string
  confidence: number
  suggestions: string[]
  fallback: boolean
  title?: string
}

export async function analyzeDescription(
  description: string,
  fileContent?: string
): Promise<AnalysisResult> {
  const content = fileContent || description
  
  const { category, confidence: detectionConfidence } = detectCategory(content)
  
  const template = promptTemplates[category]
  
  const systemPrompt = getSystemPrompt(category)
  const userPrompt = fileContent
    ? `User provided file content:\n\n${fileContent}\n\nUse this file as reference for the landing page content.`
    : getAnalysisPrompt(content, category)
  
  try {
    const openai = getOpenAI()
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 2000
    })
    
    const markdown = response.choices[0]?.message?.content || ''
    
    const titleMatch = content.match(/(?:called|name is|for|project|site)(?:\s+is)?\s+["']?([A-Z][^\s,"']+(?:\s+[A-Z][^\s,"']+)*)["']?/i)
    const extractedTitle = titleMatch ? titleMatch[1] : template.defaultTitle
    
    const suggestions = extractSuggestions(markdown, category)
    
    return {
      markdown,
      category,
      categoryName: template.name,
      confidence: Math.max(detectionConfidence, 0.85),
      suggestions,
      fallback: false,
      title: extractedTitle
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    
    return generateFallbackMarkdown(content, category, template)
  }
}

function extractSuggestions(markdown: string, category: Category): string[] {
  const suggestions: string[] = []
  
  if (!markdown.includes('headline:') || markdown.includes('headline: [')) {
    suggestions.push('Review the headline - it may contain placeholder text')
  }
  if (!markdown.includes('feature0desc:') && !markdown.includes('feature1desc:')) {
    suggestions.push('Add feature descriptions for better engagement')
  }
  if (!markdown.includes('@')) {
    suggestions.push('Replace placeholder email with real contact email')
  }
  if (markdown.includes('Your Address Here') || markdown.includes('[address]')) {
    suggestions.push('Update contact address with real location')
  }
  
  return suggestions
}

function generateFallbackMarkdown(
  description: string,
  category: Category,
  template: any
): AnalysisResult {
  const title = template.defaultTitle
  
  const markdown = `# Hero
headline: ${template.heroDefaults.headline}
subheadline: ${template.heroDefaults.subheadline}
ctaText: ${template.ctaDefaults.buttonText}
ctaLink: #signup

---

# Features
title: ${template.name} Features
features:
  - ${template.featuresDefaults[0]}
  - ${template.featuresDefaults[1]}
  - ${template.featuresDefaults[2]}
feature0desc: Experience the best ${category} solution with our platform.
feature1desc: Our expert team is dedicated to your success.
feature2desc: We provide ongoing support and updates.

---

# CTA
headline: ${template.ctaDefaults.headline}
description: ${template.ctaDefaults.description}
buttonText: ${template.ctaDefaults.buttonText}
buttonLink: #signup

---

# Contact
title: ${template.contactDefaults.title}
email: hello@${title.toLowerCase().replace(/\s+/g, '')}.com
phone: +1 555 123 4567
address: Your Address Here`
  
  return {
    markdown,
    category,
    categoryName: template.name,
    confidence: 0.5,
    suggestions: [
      'AI generation failed - using template fallback',
      'Review generated content and customize as needed',
      'Add your real contact information'
    ],
    fallback: true,
    title
  }
}

export async function improveMarkdown(
  currentMarkdown: string,
  instructions: string
): Promise<string> {
  const systemPrompt = `You are an expert landing page copywriter. Improve the existing markdown based on user instructions while maintaining the DSL format with # SectionName headers and --- separators.`
  
  const userPrompt = `Current markdown:\n${currentMarkdown}\n\nInstructions: ${instructions}\n\nProvide the improved markdown:`
  
  try {
    const openai = getOpenAI()
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
    
    return response.choices[0]?.message?.content || currentMarkdown
  } catch (error) {
    console.error('OpenAI improve error:', error)
    return currentMarkdown
  }
}