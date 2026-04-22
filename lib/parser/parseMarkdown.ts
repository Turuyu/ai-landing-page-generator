import { unified } from 'unified'
import remarkParse from 'remark-parse'

export interface ParsedMarkdown {
  tree: any
  content: string
}

export async function parseMarkdown(content: string): Promise<ParsedMarkdown> {
  const processor = unified().use(remarkParse)
  
  const tree = processor.parse(content)
  
  const processed = await processor.run(tree)
  
  return {
    tree: processed,
    content
  }
}