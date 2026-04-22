import { AST, Section, HeroSection, FeaturesSection, CTASection, ContactSection } from '@/types/ast'
import { ExtractedSection } from './sectionExtractor'

export interface FormData {
  title?: string
  theme?: 'light' | 'dark'
  primaryColor?: string
  font?: string
  [key: string]: any
}

export function mapToAST(extractedSections: ExtractedSection[], formData: FormData): AST {
  const sections: Section[] = []
  
  for (const section of extractedSections) {
    switch (section.type) {
      case 'hero': {
        const hero: HeroSection = {
          type: 'hero',
          data: {
            headline: section.properties.headline || formData.headline || 'Welcome',
            subheadline: section.properties.subheadline || formData.subheadline || '',
            ctaText: section.properties.ctatext || formData.ctaText,
            ctaLink: section.properties.ctalink || formData.ctaLink,
            backgroundImage: section.properties.backgroundimage || formData.backgroundImage
          },
          meta: {
            title: formData.title,
            theme: formData.theme || 'light',
            primaryColor: formData.primaryColor,
            font: formData.font
          }
        }
        sections.push(hero)
        break
      }
      case 'features': {
        const featuresArray = section.properties.features || formData.features || ''
        const featuresList = Array.isArray(featuresArray) 
          ? featuresArray as string[]
          : featuresArray.split('|').map((f: string) => f.trim()).filter(Boolean)
        
        const features = featuresList.map((title: string, index: number) => ({
          title,
          description: section.properties[`feature${index}desc`] || formData[`feature${index}Desc`] || '',
          icon: section.properties[`feature${index}icon`] || formData[`feature${index}Icon`]
        }))
        
        const featureSection: FeaturesSection = {
          type: 'features',
          data: {
            title: section.properties.title || formData.featuresTitle || 'Our Features',
            features
          },
          meta: {
            title: formData.title,
            theme: formData.theme || 'light',
            primaryColor: formData.primaryColor,
            font: formData.font
          }
        }
        sections.push(featureSection)
        break
      }
      case 'cta': {
        const cta: CTASection = {
          type: 'cta',
          data: {
            headline: section.properties.headline || formData.ctaHeadline || 'Get Started',
            description: section.properties.description || formData.ctaDescription || '',
            buttonText: section.properties.buttontext || formData.ctaButtonText || 'Click Here',
            buttonLink: section.properties.buttonlink || formData.ctaButtonLink || '#'
          },
          meta: {
            title: formData.title,
            theme: formData.theme || 'light',
            primaryColor: formData.primaryColor,
            font: formData.font
          }
        }
        sections.push(cta)
        break
      }
      case 'contact': {
        const contact: ContactSection = {
          type: 'contact',
          data: {
            title: section.properties.title || formData.contactTitle || 'Contact Us',
            email: section.properties.email || formData.email,
            phone: section.properties.phone || formData.phone,
            address: section.properties.address || formData.address
          },
          meta: {
            title: formData.title,
            theme: formData.theme || 'light',
            primaryColor: formData.primaryColor,
            font: formData.font
          }
        }
        sections.push(contact)
        break
      }
    }
  }
  
  return {
    meta: {
      title: formData.title,
      theme: formData.theme || 'light',
      primaryColor: formData.primaryColor,
      font: formData.font
    },
    sections
  }
}