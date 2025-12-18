import { envConfigs } from '@/config';

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BananaPro',
    url: envConfigs.app_url || 'https://bananapro.dev',
    logo: `${envConfigs.app_url || 'https://bananapro.dev'}/logo.png`,
    description:
      'BananaPro is the leading platform for Nano Banana AI image generation, empowering creators with Google Nano Banana tools.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@bananapro.dev',
      contactType: 'customer support',
    },
    sameAs: [
      'https://x.com/bananapro',
      'https://github.com/bananapro',
      'https://discord.gg/bananapro',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SoftwareApplicationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Nano Banana Pro',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    url: envConfigs.app_url || 'https://bananapro.dev',
    description:
      'The ultimate Google Nano Banana AI image generator featuring consistent characters, 3D manipulation, and studio-grade controls.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available with premium subscription options',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '100',
      bestRating: '5',
      worstRating: '1',
    },
    featureList: [
      'AI Image Generation',
      'Consistent Character Editing',
      'Google Cloud Integration',
      '3D Object Manipulation',
      'Commercial Usage Rights',
      'API Access',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const appUrl = envConfigs.app_url || 'https://bananapro.dev';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BananaPro - Nano Banana Pro AI Image Generator',
    url: appUrl,
    description:
      'Create stunning AI images with Nano Banana Pro. The ultimate Google Nano Banana image generator.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${appUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema() {
  const faqs = [
    {
      question: 'What is Nano Banana AI?',
      answer:
        'Nano Banana AI is the community name for the latest generation of advanced image models, specifically referring to Google Nano Banana (Gemini) technology known for superior reasoning and consistency.',
    },
    {
      question: 'Is BananaPro free to use?',
      answer:
        'We offer a free tier that lets you explore Nano Banana capabilities. For heavy usage and advanced features, we have affordable subscription plans.',
    },
    {
      question: 'How does Nano Banana differ from Midjourney?',
      answer:
        "Nano Banana excels at prompt adherence and specific editing tasks like keeping a character's face the same across different poses, which is a key advantage of Google Nano Banana models.",
    },
    {
      question: 'Can I use generated images commercially?',
      answer:
        'Yes! All images generated via BananaPro come with full commercial rights, so you can use your Nano Banana AI art for any project.',
    },
    {
      question: 'Do you use official Google Nano Banana models?',
      answer:
        'Yes, our platform is built on top of the authentic Google Nano Banana API to ensure you get the highest quality results possible.',
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function SchemaMarkup() {
  return (
    <>
      <OrganizationSchema />
      <SoftwareApplicationSchema />
      <WebSiteSchema />
      <FAQSchema />
    </>
  );
}
