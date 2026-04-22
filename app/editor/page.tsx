'use client'

import { useState, useRef } from 'react'

type EditorMode = 'chat' | 'manual'
type AnalysisState = 'idle' | 'analyzing' | 'ready' | 'error'

interface AccordionSectionProps {
  title: string
  icon: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function AccordionSection({ title, icon, children, defaultOpen = false }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="accordion-section" style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)',
      overflow: 'hidden',
      transition: 'var(--transition-base)'
    }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="accordion-header"
        style={{
          width: '100%',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          fontFamily: 'inherit'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.25rem' }}>{icon}</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{title}</span>
        </div>
        <span style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'var(--transition-fast)',
          fontSize: '0.8rem',
          color: 'var(--accent-cyan)'
        }}>▼</span>
      </button>
      <div className="accordion-content" style={{
        maxHeight: isOpen ? '1000px' : '0',
        overflow: 'hidden',
        transition: 'max-height var(--transition-base), padding var(--transition-base)',
        padding: isOpen ? '0 24px 24px' : '0 24px 0'
      }}>
        {children}
      </div>
    </div>
  )
}

export default function EditorPage() {
  const [mode, setMode] = useState<EditorMode>('chat')
  const [description, setDescription] = useState('')
  const [fileContent, setFileContent] = useState('')
  const [fileName, setFileName] = useState('')
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle')
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [analysisError, setAnalysisError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    theme: 'light' as 'light' | 'dark',
    primaryColor: '#00d4ff',
    font: 'Outfit',
    headline: '',
    subheadline: '',
    ctaText: '',
    ctaLink: '',
    featuresTitle: '',
    features: '',
    ctaHeadline: '',
    ctaDescription: '',
    ctaButtonText: '',
    ctaButtonLink: '',
    contactTitle: '',
    email: '',
    phone: '',
    address: ''
  })
  const [markdown, setMarkdown] = useState(`# Hero
headline: Welcome to Our Product
subheadline: The best solution for your business
ctaText: Get Started
ctaLink: #signup

---

# Features
title: Our Features
features:
  - Feature 1
  - Feature 2
  - Feature 3
feature0desc: First feature description
feature1desc: Second feature description
feature2desc: Third feature description

---

# CTA
headline: Ready to Get Started?
description: Join thousands of satisfied customers
buttonText: Sign Up Now
buttonLink: #signup

---

# Contact
title: Contact Us
email: hello@example.com
phone: +1 (555) 123-4567
address: 123 Business St, San Francisco, CA`)
  const [generatedHtml, setGeneratedHtml] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedAst, setGeneratedAst] = useState<any>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.name.endsWith('.md')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setFileContent(content)
        setFileName(file.name)
        setMarkdown(content)
      }
      reader.readAsText(file)
    } else {
      setAnalysisError('Please upload a .md file')
    }
  }

  const handleAnalyze = async () => {
    if (!description && !fileContent) {
      setAnalysisError('Please describe your project or upload a .md file')
      return
    }

    setAnalysisState('analyzing')
    setAnalysisError('')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description, 
          fileContent: fileContent || undefined 
        })
      })

      const data = await response.json()

      if (data.error) {
        setAnalysisError(data.error)
        setAnalysisState('error')
        return
      }

      setAnalysisResult(data)
      setMarkdown(data.markdown)
      
      if (data.title) {
        setFormData(prev => ({ ...prev, title: data.title }))
      }
      
      setAnalysisState('ready')
      setDescription('')
      setFileContent('')
      setFileName('')
    } catch (error) {
      console.error(error)
      setAnalysisError('Failed to analyze. Please try again.')
      setAnalysisState('error')
    }
  }

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, markdown })
      })
      const data = await response.json()
      if (data.html) {
        setGeneratedHtml(data.html)
        setGeneratedAst(data.ast)
      } else {
        alert(data.error || 'Failed to generate')
      }
    } catch (error) {
      console.error(error)
      alert('Failed to generate')
    } finally {
      setLoading(false)
    }
  }

  const generateZip = async () => {
    if (!generatedHtml) return
    
    const JSZip = (await import('jszip')).default
    const { saveAs } = await import('file-saver')
    
    const zip = new JSZip()
    zip.file('index.html', generatedHtml)
    
    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, 'landing-page.zip')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'var(--transition-fast)',
    fontFamily: 'inherit'
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginBottom: '8px'
  }

  const chatInputStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical' as const,
    lineHeight: 1.6
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      fontFamily: "'Outfit', -apple-system, sans-serif"
    }}>
      <header style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-default)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em'
        }}>
          <span style={{ color: 'var(--accent-cyan)' }}>AI</span> Landing Page Generator
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '1px solid var(--accent-cyan)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--accent-cyan)',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              transition: 'var(--transition-base)',
              boxShadow: 'none',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'var(--accent-cyan)'
                e.currentTarget.style.color = 'var(--bg-primary)'
                e.currentTarget.style.boxShadow = 'var(--glow-cyan)'
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--accent-cyan)'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            {loading ? 'Generating...' : 'Generate Preview'}
          </button>
          {generatedHtml && (
            <button
              onClick={generateZip}
              style={{
                padding: '12px 24px',
                background: 'var(--accent-cyan)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--bg-primary)',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-base)',
                boxShadow: 'var(--glow-cyan)',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--glow-cyan-strong)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--glow-cyan)'
              }}
            >
              Export ZIP
            </button>
          )}
        </div>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: mode === 'chat' ? '1fr 1fr' : '1fr 1fr',
        gap: '24px',
        padding: '24px 32px',
        maxWidth: '1800px',
        margin: '0 auto'
      }}>
        <div className="form-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-default)',
            padding: '16px 24px'
          }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                onClick={() => setMode('chat')}
                style={{
                  padding: '10px 20px',
                  background: mode === 'chat' ? 'var(--accent-cyan)' : 'transparent',
                  border: '1px solid var(--accent-cyan)',
                  borderRadius: 'var(--radius-sm)',
                  color: mode === 'chat' ? 'var(--bg-primary)' : 'var(--accent-cyan)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition-base)',
                  fontFamily: 'inherit'
                }}
              >
                Chat AI
              </button>
              <button
                onClick={() => setMode('manual')}
                style={{
                  padding: '10px 20px',
                  background: mode === 'manual' ? 'var(--accent-cyan)' : 'transparent',
                  border: '1px solid var(--accent-cyan)',
                  borderRadius: 'var(--radius-sm)',
                  color: mode === 'manual' ? 'var(--bg-primary)' : 'var(--accent-cyan)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition-base)',
                  fontFamily: 'inherit'
                }}
              >
                Manual
              </button>
            </div>

            {mode === 'chat' && (
              <div className="chat-mode" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Describe your project and let AI create your landing page. You can also upload a .md file with your design.
                </p>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Describe Your Project</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={chatInputStyle}
                    placeholder="Ejemplo: Landing page para un restaurante Italiano llamado 'La Trattoria'. Necesito mostrar nuestro menu, reservas y horarios. Tambien quiero que los clientes puedan ver nuestra historia y reservas en línea."
                  />
                </div>

                <div style={{ 
                  marginBottom: '16px',
                  padding: '16px',
                  border: '2px dashed var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'var(--bg-tertiary)'
                }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  {fileName ? (
                    <div style={{ color: 'var(--accent-cyan)' }}>
                      <span style={{ fontSize: '1.5rem' }}>📄</span>
                      <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>{fileName}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Click to replace</p>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '8px' }}>📁</span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Drop .md file here or click to upload
                      </p>
                    </div>
                  )}
                </div>

                {analysisError && (
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#ef4444',
                    fontSize: '0.85rem',
                    marginBottom: '16px'
                  }}>
                    {analysisError}
                  </div>
                )}

                {analysisResult && analysisState === 'ready' && (
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ color: '#22c55e', fontSize: '1rem' }}>✓</span>
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>
                        Generated: {analysisResult.categoryName}
                      </span>
                      {analysisResult.fallback && (
                        <span style={{
                          fontSize: '0.7rem',
                          background: 'rgba(234, 179, 8, 0.2)',
                          color: '#eab308',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)'
                        }}>
                          Template
                        </span>
                      )}
                    </div>
                    {analysisResult.suggestions?.length > 0 && (
                      <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '16px' }}>
                        {analysisResult.suggestions.map((s: string, i: number) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={analysisState === 'analyzing' || (!description && !fileContent)}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    background: 'var(--accent-cyan)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--bg-primary)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: analysisState === 'analyzing' ? 'not-allowed' : 'pointer',
                    opacity: analysisState === 'analyzing' ? 0.7 : 1,
                    transition: 'var(--transition-base)',
                    boxShadow: 'var(--glow-cyan)',
                    fontFamily: 'inherit'
                  }}
                >
                  {analysisState === 'analyzing' ? '🤔 Analyzing...' : '✨ Generate with AI'}
                </button>
              </div>
            )}

            {mode === 'manual' && (
              <div className="manual-mode" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                <AccordionSection title="Page Settings" icon="⚙️" defaultOpen={true}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        style={inputStyle}
                        placeholder="My Landing Page"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Theme</label>
                      <select
                        name="theme"
                        value={formData.theme}
                        onChange={handleInputChange}
                        style={inputStyle}
                      >
                        <option value="light" style={{ background: 'var(--bg-secondary)' }}>Light</option>
                        <option value="dark" style={{ background: 'var(--bg-secondary)' }}>Dark</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Primary Color</label>
                      <input
                        type="color"
                        name="primaryColor"
                        value={formData.primaryColor}
                        onChange={handleInputChange}
                        style={{ ...inputStyle, height: '48px', padding: '4px', cursor: 'pointer' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Font</label>
                      <select
                        name="font"
                        value={formData.font}
                        onChange={handleInputChange}
                        style={inputStyle}
                      >
                        <option value="Outfit" style={{ background: 'var(--bg-secondary)' }}>Outfit</option>
                        <option value="Inter" style={{ background: 'var(--bg-secondary)' }}>Inter</option>
                        <option value="Space Grotesk" style={{ background: 'var(--bg-secondary)' }}>Space Grotesk</option>
                        <option value="Syne" style={{ background: 'var(--bg-secondary)' }}>Syne</option>
                        <option value="Clash Display" style={{ background: 'var(--bg-secondary)' }}>Clash Display</option>
                      </select>
                    </div>
                  </div>
                </AccordionSection>

                <AccordionSection title="Hero Section" icon="🎯">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Headline</label>
                      <input
                        type="text"
                        name="headline"
                        value={formData.headline}
                        onChange={handleInputChange}
                        style={inputStyle}
                        placeholder="Welcome to Our Product"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Subheadline</label>
                      <input
                        type="text"
                        name="subheadline"
                        value={formData.subheadline}
                        onChange={handleInputChange}
                        style={inputStyle}
                        placeholder="The best solution for your business"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>CTA Text</label>
                        <input
                          type="text"
                          name="ctaText"
                          value={formData.ctaText}
                          onChange={handleInputChange}
                          style={inputStyle}
                          placeholder="Get Started"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>CTA Link</label>
                        <input
                          type="text"
                          name="ctaLink"
                          value={formData.ctaLink}
                          onChange={handleInputChange}
                          style={inputStyle}
                          placeholder="#signup"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionSection>

                <AccordionSection title="Features Section" icon="✨">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Title</label>
                      <input
                        type="text"
                        name="featuresTitle"
                        value={formData.featuresTitle}
                        onChange={handleInputChange}
                        style={inputStyle}
                        placeholder="Our Features"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Features (comma-separated)</label>
                      <textarea
                        name="features"
                        value={formData.features}
                        onChange={handleInputChange}
                        style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                        placeholder="Feature 1, Feature 2, Feature 3"
                      />
                    </div>
                  </div>
                </AccordionSection>

                <AccordionSection title="CTA Section" icon="🚀">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Headline</label>
                      <input
                        type="text"
                        name="ctaHeadline"
                        value={formData.ctaHeadline}
                        onChange={handleInputChange}
                        style={inputStyle}
                        placeholder="Ready to Get Started?"
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Description</label>
                      <input
                        type="text"
                        name="ctaDescription"
                        value={formData.ctaDescription}
                        onChange={handleInputChange}
                        style={inputStyle}
                        placeholder="Join thousands of satisfied customers"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Button Text</label>
                        <input
                          type="text"
                          name="ctaButtonText"
                          value={formData.ctaButtonText}
                          onChange={handleInputChange}
                          style={inputStyle}
                          placeholder="Sign Up Now"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Button Link</label>
                        <input
                          type="text"
                          name="ctaButtonLink"
                          value={formData.ctaButtonLink}
                          onChange={handleInputChange}
                          style={inputStyle}
                          placeholder="#signup"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionSection>

                <AccordionSection title="Contact Section" icon="📧">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={labelStyle}>Title</label>
                      <input
                        type="text"
                        name="contactTitle"
                        value={formData.contactTitle}
                        onChange={handleInputChange}
                        style={inputStyle}
                        placeholder="Contact Us"
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={labelStyle}>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          style={inputStyle}
                          placeholder="hello@example.com"
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Phone</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          style={inputStyle}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        style={inputStyle}
                        placeholder="123 Business St, San Francisco, CA"
                      />
                    </div>
                  </div>
                </AccordionSection>

                <AccordionSection title="Markdown DSL" icon="📝">
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      Edit the Markdown below to customize your sections using DSL syntax.
                    </p>
                    <textarea
                      value={markdown}
                      onChange={(e) => setMarkdown(e.target.value)}
                      style={{
                        ...inputStyle,
                        minHeight: '300px',
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        fontSize: '0.85rem',
                        lineHeight: 1.6
                      }}
                      placeholder="# Hero
headline: Welcome to Our Product
subheadline: The best solution for your business
ctaText: Get Started
ctaLink: #signup"
                    />
                  </div>
                </AccordionSection>
              </div>
            )}
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-default)',
          overflow: 'hidden',
          position: 'sticky',
          top: '100px',
          height: 'fit-content',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h2 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>👁️</span> Preview
            </h2>
            {generatedHtml && (
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--accent-cyan)',
                background: 'rgba(0, 212, 255, 0.1)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 500
              }}>
                Generated
              </span>
            )}
          </div>
          <div style={{ padding: '16px' }}>
            {generatedHtml ? (
              <iframe
                srcDoc={generatedHtml}
                style={{
                  width: '100%',
                  height: '800px',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  background: '#fff'
                }}
                title="Preview"
              />
            ) : (
              <div style={{
                height: '800px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px dashed var(--border-default)'
              }}>
                <span style={{ fontSize: '3rem', marginBottom: '16px' }}>🎨</span>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Click &quot;Generate Preview&quot; to see the result
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '8px' }}>
                  Your landing page will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .form-panel > * {
          animation: fadeInUp 0.4s ease-out forwards;
          opacity: 0;
        }
        
        .form-panel > *:nth-child(1) { animation-delay: 0ms; }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: var(--border-default) var(--bg-secondary);
        }
        
        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        *::-webkit-scrollbar-track {
          background: var(--bg-secondary);
        }
        
        *::-webkit-scrollbar-thumb {
          background: var(--border-default);
          border-radius: 3px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: var(--border-hover);
        }
        
        select option {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  )
}