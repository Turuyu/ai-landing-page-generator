export interface AST {
  meta: MetaInfo
  sections: Section[]
}

export interface MetaInfo {
  title?: string
  theme?: 'light' | 'dark'
  primaryColor?: string
  font?: string
}

export type Section = HeroSection | FeaturesSection | CTASection | ContactSection

export interface HeroSection {
  type: 'hero'
  data: {
    headline: string
    subheadline: string
    ctaText?: string
    ctaLink?: string
    backgroundImage?: string
  }
  meta: MetaInfo
}

export interface FeaturesSection {
  type: 'features'
  data: {
    title: string
    features: Array<{
      title: string
      description: string
      icon?: string
    }>
  }
  meta: MetaInfo
}

export interface CTASection {
  type: 'cta'
  data: {
    headline: string
    description: string
    buttonText: string
    buttonLink: string
  }
  meta: MetaInfo
}

export interface ContactSection {
  type: 'contact'
  data: {
    title: string
    email?: string
    phone?: string
    address?: string
  }
  meta: MetaInfo
}