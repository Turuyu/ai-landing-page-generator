import { NextRequest, NextResponse } from 'next/server'
import { parseMarkdown } from '@/lib/parser/parseMarkdown'
import { extractSections } from '@/lib/parser/sectionExtractor'
import { mapToAST } from '@/lib/parser/mapper'
import { validateAST } from '@/lib/ast/validator'
import { renderHTML } from '@/lib/generator/renderHTML'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formData, markdown } = body
    
    if (!markdown) {
      return NextResponse.json(
        { error: 'Markdown content is required' },
        { status: 400 }
      )
    }
    
    const extracted = extractSections(markdown)
    
    const ast = mapToAST(extracted, formData || {})
    
    const validation = validateAST(ast)
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid AST', details: validation.errors },
        { status: 400 }
      )
    }
    
    const html = renderHTML(ast)
    
    return NextResponse.json({ html, ast })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate landing page' },
      { status: 500 }
    )
  }
}