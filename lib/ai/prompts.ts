import { z } from 'zod'

export const CategorySchema = z.enum([
  'saas',
  'restaurant',
  'portfolio',
  'ecommerce',
  'lead_magnet',
  'course',
  'app',
  'service',
  'event',
  'generic'
])

export type Category = z.infer<typeof CategorySchema>

export interface PromptTemplate {
  category: Category
  name: string
  description: string
  keywords: string[]
  tone: string
  sections: string[]
  defaultTitle: string
  heroDefaults: {
    headline: string
    subheadline: string
  }
  featuresDefaults: string[]
  ctaDefaults: {
    headline: string
    description: string
    buttonText: string
  }
  contactDefaults: {
    title: string
    required: string[]
  }
}

export const promptTemplates: Record<Category, PromptTemplate> = {
  saas: {
    category: 'saas',
    name: 'SaaS / Software',
    description: 'Landing page for software products, B2B platforms, and web apps',
    keywords: ['saas', 'software', 'app', 'platform', 'tool', 'dashboard', 'solution', 'digital', 'tecnología', 'tech', 'startup', 'SaaS', 'platform'],
    tone: 'professional, innovative, trustworthy',
    sections: ['hero', 'features', 'cta', 'contact'],
    defaultTitle: 'My SaaS Product',
    heroDefaults: {
      headline: 'Transform Your Workflow with Our Platform',
      subheadline: 'The all-in-one solution that helps teams collaborate smarter, not harder.'
    },
    featuresDefaults: [
      'Real-time Collaboration',
      'Advanced Analytics',
      'Seamless Integration'
    ],
    ctaDefaults: {
      headline: 'Ready to Transform Your Business?',
      description: 'Join thousands of companies already using our platform.',
      buttonText: 'Start Free Trial'
    },
    contactDefaults: {
      title: 'Get in Touch',
      required: ['email']
    }
  },
  
  restaurant: {
    category: 'restaurant',
    name: 'Restaurant / Food',
    description: 'Landing page for restaurants, cafes, and food businesses',
    keywords: ['restaurant', 'comida', 'food', 'cocina', 'chef', 'gastronomic', 'cafe', 'café', 'menu', 'dinner', 'lunch', 'breakfast', 'gourmet', 'bar', 'restaurant'],
    tone: 'elegant, appetizing, welcoming',
    sections: ['hero', 'features', 'cta', 'contact'],
    defaultTitle: 'Our Restaurant',
    heroDefaults: {
      headline: 'An Unforgettable Culinary Experience',
      subheadline: 'Fresh ingredients, expert chefs, and an atmosphere that delights.'
    },
    featuresDefaults: [
      'Fresh Local Ingredients',
      'Chef\'s Specialties',
      'Private Events'
    ],
    ctaDefaults: {
      headline: 'Reserve Your Table Today',
      description: 'Book now and enjoy an exceptional dining experience.',
      buttonText: 'Make a Reservation'
    },
    contactDefaults: {
      title: 'Contact Us',
      required: ['phone', 'address']
    }
  },
  
  portfolio: {
    category: 'portfolio',
    name: 'Portfolio / Personal',
    description: 'Personal portfolio for designers, developers, and creative professionals',
    keywords: ['portfolio', 'trabajos', 'proyectos', 'diseños', 'creative', 'designer', 'developer', 'photographer', 'artist', 'writer', 'freelance', 'personal', 'showcase', 'portfolio'],
    tone: 'creative, professional, distinctive',
    sections: ['hero', 'features', 'cta', 'contact'],
    defaultTitle: 'My Portfolio',
    heroDefaults: {
      headline: 'Creating Digital Experiences That Matter',
      subheadline: 'Designer & Developer bringing ideas to life through code and creativity.'
    },
    featuresDefaults: [
      'Brand Identity',
      'Web Development',
      'UI/UX Design'
    ],
    ctaDefaults: {
      headline: 'Let\'s Work Together',
      description: 'Have a project in mind? I\'d love to hear about it.',
      buttonText: 'Get in Touch'
    },
    contactDefaults: {
      title: 'Contact Me',
      required: ['email']
    }
  },
  
  ecommerce: {
    category: 'ecommerce',
    name: 'E-commerce / Store',
    description: 'Landing page for online stores and product sales',
    keywords: ['shop', 'tienda', 'productos', 'comprar', 'buy', 'store', 'ecommerce', 'online', 'venta', 'product', 'merchandise', 'store'],
    tone: 'exciting, trustworthy, professional',
    sections: ['hero', 'features', 'cta', 'contact'],
    defaultTitle: 'Our Store',
    heroDefaults: {
      headline: 'Discover Premium Products',
      subheadline: 'Quality you can trust, delivered to your door.'
    },
    featuresDefaults: [
      'Free Shipping',
      '30-Day Returns',
      'Secure Payment'
    ],
    ctaDefaults: {
      headline: 'Shop Now',
      description: 'Free shipping on orders over $50. Limited time offer!',
      buttonText: 'Shop All Products'
    },
    contactDefaults: {
      title: 'Contact Us',
      required: ['email']
    }
  },
  
  lead_magnet: {
    category: 'lead_magnet',
    name: 'Lead Magnet / Marketing',
    description: 'Landing page for lead generation and marketing campaigns',
    keywords: ['ebook', 'descarga', 'free', 'gratis', 'download', 'lead', 'guía', 'guide', 'checklist', 'template', 'newsletter', 'signup', 'lead magnet'],
    tone: 'persuasive, valuable, action-oriented',
    sections: ['hero', 'features', 'cta', 'contact'],
    defaultTitle: 'Free Download',
    heroDefaults: {
      headline: 'Get Your Free Guide',
      subheadline: 'The ultimate resource to help you succeed.'
    },
    featuresDefaults: [
      'Actionable Tips',
      'Expert Insights',
      'Ready to Use Templates'
    ],
    ctaDefaults: {
      headline: 'Download Now - It\'s Free!',
      description: 'Join 10,000+ others who\'ve already downloaded this guide.',
      buttonText: 'Get Free Access'
    },
    contactDefaults: {
      title: 'Questions?',
      required: ['email']
    }
  },
  
  course: {
    category: 'course',
    name: 'Course / Education',
    description: 'Landing page for online courses and educational content',
    keywords: ['course', 'curso', 'learn', 'ensenando', 'education', 'training', 'tutorial', 'class', 'workshop', 'certification', 'masterclass', 'online course'],
    tone: 'educational, inspiring, professional',
    sections: ['hero', 'features', 'cta', 'contact'],
    defaultTitle: 'My Course',
    heroDefaults: {
      headline: 'Master New Skills in 30 Days',
      subheadline: 'A comprehensive course designed to take you from beginner to expert.'
    },
    featuresDefaults: [
      'Video Lessons',
      'Hands-on Projects',
      'Certificate of Completion'
    ],
    ctaDefaults: {
      headline: 'Enroll Now',
      description: 'Early bird pricing - 50% off for a limited time!',
      buttonText: 'Start Learning'
    },
    contactDefaults: {
      title: 'Questions?',
      required: ['email']
    }
  },
  
  app: {
    category: 'app',
    name: 'Mobile App',
    description: 'Landing page for mobile apps and applications',
    keywords: ['app', 'application', 'mobile', 'ios', 'android', 'download', 'iphone', 'smartphone', 'download', 'software', 'app'],
    tone: 'modern, sleek, user-friendly',
    sections: ['hero', 'features', 'cta', 'contact'],
    defaultTitle: 'My App',
    heroDefaults: {
      headline: 'The App That Changes Everything',
      subheadline: 'Download now and experience the difference.'
    },
    featuresDefaults: [
      'Intuitive Design',
      'Fast Performance',
      'Regular Updates'
    ],
    ctaDefaults: {
      headline: 'Download on App Store',
      description: 'Available now on iOS and Android.',
      buttonText: 'Download Now'
    },
    contactDefaults: {
      title: 'Contact Support',
      required: ['email']
    }
  },
  
  service: {
    category: 'service',
    name: 'Service Business',
    description: 'Landing page for professional services',
    keywords: ['service', 'servicio', 'consulting', 'asesoría', 'professional', 'agency', 'company', 'business', 'consultant', 'services'],
    tone: 'professional, reliable, expert',
    sections: ['hero', 'features', 'cta', 'contact'],
    defaultTitle: 'Our Services',
    heroDefaults: {
      headline: 'Professional Services You Can Trust',
      subheadline: 'Expert solutions tailored to your needs.'
    },
    featuresDefaults: [
      'Expert Team',
      'Custom Solutions',
      'Dedicated Support'
    ],
    ctaDefaults: {
      headline: 'Let\'s Discuss Your Project',
      description: 'Book a free consultation today.',
      buttonText: 'Contact Us'
    },
    contactDefaults: {
      title: 'Contact Us',
      required: ['email', 'phone']
    }
  },
  
  event: {
    category: 'event',
    name: 'Event',
    description: 'Landing page for events, conferences, and webinars',
    keywords: ['event', 'evento', 'conference', 'conferencia', 'webinar', 'seminar', 'workshop', 'meetup', 'summit', 'event'],
    tone: 'exciting, urgent, professional',
    sections: ['hero', 'features', 'cta', 'contact'],
    defaultTitle: 'Our Event',
    heroDefaults: {
      headline: 'The Event You Can\'t Miss',
      subheadline: 'Join us for an unforgettable experience.'
    },
    featuresDefaults: [
      'Expert Speakers',
      'Networking Opportunities',
      'Interactive Sessions'
    ],
    ctaDefaults: {
      headline: 'Register Now',
      description: 'Limited spots available. Reserve yours today!',
      buttonText: 'Register Now'
    },
    contactDefaults: {
      title: 'Questions?',
      required: ['email']
    }
  },
  
  generic: {
    category: 'generic',
    name: 'Generic',
    description: 'General purpose landing page',
    keywords: ['landing', 'page', 'website', 'sitio', 'general', 'default', 'business', 'company', 'generic'],
    tone: 'professional, clear, modern',
    sections: ['hero', 'features', 'cta', 'contact'],
    defaultTitle: 'My Landing Page',
    heroDefaults: {
      headline: 'Welcome to Our Site',
      subheadline: 'We provide solutions that matter.'
    },
    featuresDefaults: [
      'Quality Service',
      'Customer Focus',
      'Proven Results'
    ],
    ctaDefaults: {
      headline: 'Get Started Today',
      description: 'Let\'s work together to achieve your goals.',
      buttonText: 'Contact Us'
    },
    contactDefaults: {
      title: 'Contact Us',
      required: ['email']
    }
  }
}

export function detectCategory(description: string): { category: Category; confidence: number } {
  const lowerDesc = description.toLowerCase()
  const scores: Record<Category, number> = {
    saas: 0,
    restaurant: 0,
    portfolio: 0,
    ecommerce: 0,
    lead_magnet: 0,
    course: 0,
    app: 0,
    service: 0,
    event: 0,
    generic: 0
  }
  
  for (const [cat, template] of Object.entries(promptTemplates)) {
    for (const keyword of template.keywords) {
      if (lowerDesc.includes(keyword.toLowerCase())) {
        scores[cat as Category] += 1
      }
    }
  }
  
  let maxScore = 0
  let detectedCategory: Category = 'generic'
  
  for (const [cat, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      detectedCategory = cat as Category
    }
  }
  
  const confidence = maxScore > 0 ? Math.min(maxScore / 2, 1) : 0.3
  
  return {
    category: detectedCategory,
    confidence
  }
}

export function getSystemPrompt(category: Category): string {
  const template = promptTemplates[category]
  
  return `You are an expert landing page copywriter. Generate professional landing page content based on the user's description.

Category: ${template.name}
Tone: ${template.tone}

Generate content in this DSL format:
# Hero
headline: [compelling headline]
subheadline: [descriptive subheadline]
ctaText: [CTA button text]
ctaLink: #signup

---

# Features
title: [section title]
features:
  - [feature 1]
  - [feature 2]
  - [feature 3]
feature0desc: [description for feature 1]
feature1desc: [description for feature 2]
feature2desc: [description for feature 3]

---

# CTA
headline: [headline]
description: [description]
buttonText: [button text]
buttonLink: #signup

---

# Contact
title: [title]
email: [email or hello@example.com]
phone: [phone or +1 555 123 4567]
address: [address]

IMPORTANT: 
- Use proper YAML-like syntax with colons
- Use --- as section separator
- Provide at least 3 features with descriptions
- Make content compelling and professional
- Keep placeholder text realistic, not generic`
}

export function getAnalysisPrompt(description: string, category: Category): string {
  const template = promptTemplates[category]
  const defaultTitle = template.defaultTitle
  
  return `Based on this description: "${description}"

Create a professional landing page in this format:

# Hero
headline: [Create a compelling headline based on the description]
subheadline: [Create a descriptive subheadline]
ctaText: [CTA button text]
ctaLink: #signup

---

# Features
title: Why Choose Us
features:
  - [Benefit 1 based on the description]
  - [Benefit 2 based on the description]  
  - [Benefit 3 based on the description]
feature0desc: [Description of benefit 1]
feature1desc: [Description of benefit 2]
feature2desc: [Description of benefit 3]

---

# CTA
headline: Ready to Get Started?
description: Join [number or "our community"] satisfied customers
buttonText: Get Started
buttonLink: #signup

---

# Contact
title: Contact Us
email: hello@${defaultTitle.toLowerCase().replace(/\s+/g, '')}.com
phone: +1 555 123 4567
address: Your Address Here

IMPORTANT: Generate genuinely compelling copy based on the description provided. Do NOT use placeholder brackets like [Create a...]. Use realistic, non-generic content.`
}