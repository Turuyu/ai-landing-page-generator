import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export interface ExportOptions {
  filename?: string
  includeAssets?: boolean
}

export async function exportToZip(html: string, options: ExportOptions = {}): Promise<void> {
  const zip = new JSZip()
  
  zip.file('index.html', html)
  
  if (options.includeAssets) {
    const assetsFolder = zip.folder('assets')
    if (assetsFolder) {
      // Add any additional assets here
    }
  }
  
  const blob = await zip.generateAsync({ type: 'blob' })
  
  const filename = options.filename || 'landing-page'
  saveAs(blob, `${filename}.zip`)
}