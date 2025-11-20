import type { Schema, Struct } from '@strapi/strapi';

export interface CustomSectionsPainResolutionCard
  extends Struct.ComponentSchema {
  collectionName: 'components_custom_sections_pain_resolution_cards';
  info: {
    displayName: 'Pain Resolution Card';
    icon: 'bulletList';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    recommendations: Schema.Attribute.String & Schema.Attribute.Required;
    results: Schema.Attribute.String & Schema.Attribute.Required;
    signals: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CustomSectionsTestimonialCard extends Struct.ComponentSchema {
  collectionName: 'components_custom_sections_testimonial_cards';
  info: {
    displayName: 'Testimonial Card';
    icon: 'alien';
  };
  attributes: {
    ageCityText: Schema.Attribute.String & Schema.Attribute.Required;
    content: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DynamicLpDefaultHero extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_default_heroes';
  info: {
    displayName: 'Default Hero';
    icon: 'code';
  };
  attributes: {
    subtext: Schema.Attribute.Text & Schema.Attribute.Required;
    tagline: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DynamicLpHowItWorksSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_how_it_works_sections';
  info: {
    displayName: 'How it works Section';
    icon: 'clock';
  };
  attributes: {};
}

export interface DynamicLpMapsSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_maps_sections';
  info: {
    displayName: 'Maps Section';
    icon: 'pinMap';
  };
  attributes: {};
}

export interface DynamicLpPricingSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_pricing_sections';
  info: {
    displayName: 'Pricing Section';
    icon: 'priceTag';
  };
  attributes: {};
}

export interface DynamicLpTestimonialSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_testimonial_sections';
  info: {
    displayName: 'Testimonial Section';
    icon: 'crown';
  };
  attributes: {
    testimonial2: Schema.Attribute.Component<
      'custom-sections.testimonial-card',
      false
    >;
    testiomnial1: Schema.Attribute.Component<
      'custom-sections.testimonial-card',
      false
    >;
  };
}

export interface DynamicLpTrackYourProgressSection
  extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_track_your_progress_sections';
  info: {
    displayName: 'Track your progress Section';
    icon: 'arrowUp';
  };
  attributes: {};
}

export interface DynamicLpWhySection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_why_sections';
  info: {
    displayName: 'Why Section';
  };
  attributes: {
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    painCards: Schema.Attribute.Component<
      'custom-sections.pain-resolution-card',
      true
    > &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 3;
        },
        number
      >;
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
      'custom-sections.pain-resolution-card': CustomSectionsPainResolutionCard;
      'custom-sections.testimonial-card': CustomSectionsTestimonialCard;
      'dynamic-lp.default-hero': DynamicLpDefaultHero;
      'dynamic-lp.how-it-works-section': DynamicLpHowItWorksSection;
      'dynamic-lp.maps-section': DynamicLpMapsSection;
      'dynamic-lp.pricing-section': DynamicLpPricingSection;
      'dynamic-lp.testimonial-section': DynamicLpTestimonialSection;
      'dynamic-lp.track-your-progress-section': DynamicLpTrackYourProgressSection;
      'dynamic-lp.why-section': DynamicLpWhySection;
      'shared.custom-cta': SharedCustomCta;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
