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

export interface DynamicLpBenefitsListSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_benefits_list_sections';
  info: {
    description: 'Heading followed by a repeatable list of benefit rows (e.g. "Lucis vous aide \u00E0 :")';
    displayName: 'Benefits List Section';
  };
  attributes: {
    benefits: Schema.Attribute.Component<
      'dynamic-lp.title-description-item',
      true
    >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Lucis vous aide \u00E0 :'>;
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

export interface DynamicLpCheckItem extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_check_items';
  info: {
    description: 'Single checklist line (label) with a check mark';
    displayName: 'Check Item';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DynamicLpFaqsSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_faqs_sections';
  info: {
    displayName: 'Faqs Section';
  };
  attributes: {
    faqs: Schema.Attribute.Relation<'oneToMany', 'api::faq.faq'>;
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
    heroBackgroundImage: Schema.Attribute.Media<'images' | 'files'>;
    heroBackgroundVideo: Schema.Attribute.Media<'files' | 'videos'>;
    invertTextColor: Schema.Attribute.Boolean;
    subtitle: Schema.Attribute.String & Schema.Attribute.Required;
    testimonialAvatars: Schema.Attribute.Media<'images', true>;
    testimonialText: Schema.Attribute.String;
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

export interface DynamicLpHowItWorksSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_how_it_works_sections';
  info: {
    displayName: 'How It Works Section';
  };
  attributes: {};
}

export interface DynamicLpOfferHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_offer_hero_sections';
  info: {
    displayName: 'Offer Hero Section';
  };
  attributes: {
    bgImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    buy1Get1Text: Schema.Attribute.String & Schema.Attribute.Required;
    code: Schema.Attribute.String & Schema.Attribute.Required;
    firstOfferItems: Schema.Attribute.String & Schema.Attribute.Required;
    firstOfferSubtext: Schema.Attribute.String & Schema.Attribute.Required;
    firstOfferText: Schema.Attribute.String & Schema.Attribute.Required;
    getTheOfferLink: Schema.Attribute.String & Schema.Attribute.Required;
    priceCare: Schema.Attribute.String & Schema.Attribute.Required;
    priceDiscovery: Schema.Attribute.String & Schema.Attribute.Required;
    priceOriginalDiscovery: Schema.Attribute.String & Schema.Attribute.Required;
    secondOfferItems: Schema.Attribute.String & Schema.Attribute.Required;
    secondOfferSubtext: Schema.Attribute.String & Schema.Attribute.Required;
    secondOfferText: Schema.Attribute.String & Schema.Attribute.Required;
    subtitle: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DynamicLpOfferPricingSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_offer_pricing_sections';
  info: {
    description: 'Dark pricing card with plan, price, feature checklist, CTA, lab link and disclaimer';
    displayName: 'Offer Pricing Section';
  };
  attributes: {
    ctaText: Schema.Attribute.String;
    ctaUrl: Schema.Attribute.String;
    disclaimer: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Lucis ne remplace pas un avis m\u00E9dical. Nos contenus sont \u00E9ducatifs et ne constituent ni un diagnostic ni une prescription. En cas de doute, nous vous invitons \u00E0 consulter un professionnel de sant\u00E9.'>;
    features: Schema.Attribute.Component<'dynamic-lp.check-item', true>;
    footnote: Schema.Attribute.String;
    originalPrice: Schema.Attribute.String;
    planLabel: Schema.Attribute.String;
    planName: Schema.Attribute.String & Schema.Attribute.Required;
    price: Schema.Attribute.String & Schema.Attribute.Required;
    priceEquivalent: Schema.Attribute.String;
    pricePeriod: Schema.Attribute.String;
    secondaryText: Schema.Attribute.String;
    secondaryUrl: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DynamicLpPersonaHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_persona_hero_sections';
  info: {
    displayName: 'Persona Hero Section';
  };
  attributes: {
    subtitle: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    video: Schema.Attribute.Media<'videos'> & Schema.Attribute.Required;
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
    careImage: Schema.Attribute.Media<'images'>;
    discoveryCoachName: Schema.Attribute.String & Schema.Attribute.Required;
    discoveryCoachTestimonial: Schema.Attribute.String &
      Schema.Attribute.Required;
    discoveryImage: Schema.Attribute.Media<'images'>;
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

export interface DynamicLpThreeCardsOfferingSection
  extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_three_cards_offering_sections';
  info: {
    displayName: 'Three Cards Offering Section';
  };
  attributes: {};
}

export interface DynamicLpTitleDescriptionItem extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_title_description_items';
  info: {
    description: 'Reusable row/column with a title and a short description';
    displayName: 'Title Description Item';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface DynamicLpValuePropsSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_value_props_sections';
  info: {
    description: 'Row of value-proposition columns with an optional trust bar (members count + rating)';
    displayName: 'Value Props Section';
  };
  attributes: {
    membersLabel: Schema.Attribute.String;
    ratingLabel: Schema.Attribute.String;
    ratingLink: Schema.Attribute.String;
    ratingLogo: Schema.Attribute.Media<'images'>;
    ratingStars: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    valueProps: Schema.Attribute.Component<
      'dynamic-lp.title-description-item',
      true
    >;
  };
}

export interface DynamicLpWhatWeTestSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_lp_what_we_test_sections';
  info: {
    displayName: 'What We Test Section';
  };
  attributes: {};
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
      'dynamic-lp.benefits-list-section': DynamicLpBenefitsListSection;
      'dynamic-lp.biomarker-section': DynamicLpBiomarkerSection;
      'dynamic-lp.check-item': DynamicLpCheckItem;
      'dynamic-lp.faqs-section': DynamicLpFaqsSection;
      'dynamic-lp.hero-section': DynamicLpHeroSection;
      'dynamic-lp.how-app-works-section': DynamicLpHowAppWorksSection;
      'dynamic-lp.how-it-works-section': DynamicLpHowItWorksSection;
      'dynamic-lp.offer-hero-section': DynamicLpOfferHeroSection;
      'dynamic-lp.offer-pricing-section': DynamicLpOfferPricingSection;
      'dynamic-lp.persona-hero-section': DynamicLpPersonaHeroSection;
      'dynamic-lp.pricing-section': DynamicLpPricingSection;
      'dynamic-lp.problem-section': DynamicLpProblemSection;
      'dynamic-lp.testimonial-section': DynamicLpTestimonialSection;
      'dynamic-lp.three-cards-offering-section': DynamicLpThreeCardsOfferingSection;
      'dynamic-lp.title-description-item': DynamicLpTitleDescriptionItem;
      'dynamic-lp.value-props-section': DynamicLpValuePropsSection;
      'dynamic-lp.what-we-test-section': DynamicLpWhatWeTestSection;
      'shared.custom-cta': SharedCustomCta;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
