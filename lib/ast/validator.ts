import { z } from 'zod'

export const HeroSectionSchema = z.object({
  type: z.literal('hero'),
  data: z.object({
    headline: z.string(),
    subheadline: z.string(),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
    backgroundImage: z.string().optional()
  })
})

export const FeatureItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional()
})

export const FeaturesSectionSchema = z.object({
  type: z.literal('features'),
  data: z.object({
    title: z.string(),
    features: z.array(FeatureItemSchema)
  })
})

export const CTASectionSchema = z.object({
  type: z.literal('cta'),
  data: z.object({
    headline: z.string(),
    description: z.string(),
    buttonText: z.string(),
    buttonLink: z.string()
  })
})

export const ContactSectionSchema = z.object({
  type: z.literal('contact'),
  data: z.object({
    title: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional()
  })
})

export const SectionSchema = z.union([
  HeroSectionSchema,
  FeaturesSectionSchema,
  CTASectionSchema,
  ContactSectionSchema
])

export const MetaInfoSchema = z.object({
  title: z.string().optional(),
  theme: z.enum(['light', 'dark']).optional(),
  primaryColor: z.string().optional(),
  font: z.string().optional()
})

export const ASTSchema = z.object({
  meta: MetaInfoSchema,
  sections: z.array(SectionSchema)
})

export function validateAST(ast: unknown): { valid: boolean; errors?: string[] } {
  const result = ASTSchema.safeParse(ast)
  
  if (result.success) {
    return { valid: true }
  }
  
  const errors = result.error.errors.map(err => 
    `${err.path.join('.')}: ${err.message}`
  )
  
  return { valid: false, errors }
}