export interface ExtractedSection {
  type: string
  content: string
  properties: Record<string, string>
}

export function extractSections(markdown: string): ExtractedSection[] {
  const sections: ExtractedSection[] = []
  
  const sectionPattern = /^#\s+(\w+)\s*$/gm
  const separator = '---'
  
  const parts = markdown.split(separator).map(part => part.trim()).filter(Boolean)
  
  for (const part of parts) {
    const lines = part.split('\n').filter(line => line.trim())
    
    if (lines.length === 0) continue
    
    const typeLine = lines[0]
    const typeMatch = typeLine.match(/^#\s+(\w+)\s*$/)
    
    if (!typeMatch) continue
    
    const type = typeMatch[1].toLowerCase()
    const properties: Record<string, string> = {}
    let content = ''
    let isContent = false
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      
      if (line.startsWith('```')) {
        isContent = !isContent
        continue
      }
      
      if (isContent) {
        content += line + '\n'
        continue
      }
      
      const propMatch = line.match(/^([^:]+):\s*(.+)$/)
      if (propMatch) {
        const key = propMatch[1].trim().toLowerCase().replace(/\s+/g, '')
        const value = propMatch[2].trim()
        properties[key] = value
      }
    }
    
    sections.push({
      type,
      content: content.trim(),
      properties
    })
  }
  
  return sections
}