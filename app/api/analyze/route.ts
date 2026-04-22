import { NextRequest, NextResponse } from 'next/server'
import { analyzeDescription, improveMarkdown } from '@/lib/ai/analyzer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { description, fileContent, action = 'analyze' } = body
    
    if (!description && !fileContent) {
      return NextResponse.json(
        { error: 'Description or file content is required' },
        { status: 400 }
      )
    }
    
    if (action === 'improve' && !body.currentMarkdown) {
      return NextResponse.json(
        { error: 'Current markdown is required for improve action' },
        { status: 400 }
      )
    }
    
    if (!process.env.OPENAI_API_KEY && !process.env.OPENAI_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in .env.local' },
        { status: 500 }
      )
    }
    
    if (action === 'improve') {
      const improvedMarkdown = await improveMarkdown(
        body.currentMarkdown,
        description || 'Improve the content'
      )
      
      return NextResponse.json({ markdown: improvedMarkdown })
    }
    
    const result = await analyzeDescription(description, fileContent)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Analyze error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze description' },
      { status: 500 }
    )
  }
}