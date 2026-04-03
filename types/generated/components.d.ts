import type { Schema, Struct } from '@strapi/strapi';

export interface DynamicLpBannerSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_banner_sections';
  info: {
    displayName: 'Banner Section';
  };
  attributes: {
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DynamicLpBiomarkerSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_biomarker_sections';
  info: {
    displayName: 'Biomarker Section';
  };
  attributes: {
    biomarkerCards: Schema.Attribute.Relation<
      'oneToMany',
      'api::biomarker-card.biomarker-card'
    >;
    subtitle: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DynamicLpHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_hero_sections';
  info: {
    displayName: 'Hero Section';
    icon: 'brush';
  };
  attributes: {
    ctaPrimaryText: Schema.Attribute.String & Schema.Attribute.Required;
    ctaPrimaryUrl: Schema.Attribute.String & Schema.Attribute.Required;
    ctaSecondaryText: Schema.Attribute.String;
    ctaSecondaryUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    heroBackgroundImage: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    heroBackgroundVideo: Schema.Attribute.Media<'files' | 'videos'>;
    subtitle: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DynamicLpHowAppWorksSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_how_app_works_sections';
  info: {
    displayName: 'How App Works Section';
  };
  attributes: {
    ctaText: Schema.Attribute.String & Schema.Attribute.Required;
    ctaUrl: Schema.Attribute.String & Schema.Attribute.Required;
    howAppWorksCards: Schema.Attribute.Relation<
      'oneToMany',
      'api::how-app-works-card.how-app-works-card'
    >;
    subtitle: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DynamicLpPricingSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_pricing_sections';
  info: {
    displayName: 'Pricing Section';
    icon: 'priceTag';
  };
  attributes: {
    careCoachName: Schema.Attribute.String & Schema.Attribute.Required;
    careCoachTestimonial: Schema.Attribute.String & Schema.Attribute.Required;
    discoveryCoachName: Schema.Attribute.String & Schema.Attribute.Required;
    discoveryCoachTestimonial: Schema.Attribute.String &
      Schema.Attribute.Required;
  };
}

export interface DynamicLpProblemSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_problem_sections';
  info: {
    displayName: 'Problem Section';
  };
  attributes: {
    problems: Schema.Attribute.Relation<'oneToMany', 'api::problem.problem'>;
  };
}

export interface DynamicLpTestimonialSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_testimonial_sections';
  info: {
    displayName: 'Testimonial Section';
  };
  attributes: {
    ctaText: Schema.Attribute.String & Schema.Attribute.Required;
    ctaUrl: Schema.Attribute.String & Schema.Attribute.Required;
    subtitle: Schema.Attribute.String & Schema.Attribute.Required;
    testimonialCards: Schema.Attribute.Relation<
      'oneToMany',
      'api::testimonial-card.testimonial-card'
    >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedCustomCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_custom_ctas';
  info: {
    displayName: 'Custom CTA';
    icon: 'link';
  };
  attributes: {
    link: Schema.Attribute.String & Schema.Attribute.Required;
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'dynamic-lp.banner-section': DynamicLpBannerSection;
      'dynamic-lp.biomarker-section': DynamicLpBiomarkerSection;
      'dynamic-lp.hero-section': DynamicLpHeroSection;
      'dynamic-lp.how-app-works-section': DynamicLpHowAppWorksSection;
      'dynamic-lp.pricing-section': DynamicLpPricingSection;
      'dynamic-lp.problem-section': DynamicLpProblemSection;
      'dynamic-lp.testimonial-section': DynamicLpTestimonialSection;
      'shared.custom-cta': SharedCustomCta;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
