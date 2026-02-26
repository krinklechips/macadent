import eurondaE8 from "../assets/euronda-e8-apertura-edited.jpg";
import eurondaAquafilter from "../assets/euronda-aquafilter-1to1-edited-1.jpg";
import eurondaThermodisinfectors from "../assets/euronda-prosystem-cleaning-eurosafe-thermodisinfectors-ok.jpg";

export type ProductCatalogSection =
  | {
      type: "why-matters";
      title: string;
      items: string[];
    }
  | {
      type: "shop-by-type";
      title: string;
      items: Array<{
        name: string;
        description: string;
      }>;
    }
  | {
      type: "selection-guide";
      title: string;
      items: string[];
    }
  | {
      type: "cta";
      title: string;
      body: string;
      primaryLabel: string;
      primaryHref: string;
      secondaryLabel: string;
      secondaryHref: string;
    };

export type CatalogBrand = {
  name: string;
  label?: string;
};

export type ProductFamily = {
  id: string;
  name: string;
  categorySlug: string;
  subcategory: string;
  shortDesc: string;
  keySpecs: string[];
  tags: string[];
  image?: string;
  ctaType: "Request quote" | "Learn more";
  brand?: string;
  priceFrom?: number;
  featured?: boolean;
};

export type ProductCategory = {
  slug: string;
  title: string;
  intro: string;
  landingDescription: string;
  heroImage?: string;
  sections: ProductCatalogSection[];
  featuredBrands: CatalogBrand[];
  productFamilies: string[];
};

export const productCategories: ProductCategory[] = [
  {
    slug: "chairs-units",
    title: "Dental Chairs & Units",
    intro:
      "Operatory platforms, delivery systems, and room-ready chair configurations for clinics prioritizing ergonomics, throughput, and long-term reliability.",
    landingDescription: "Operatory chairs, delivery units, stools, and treatment room configurations.",
    sections: [
      {
        type: "why-matters",
        title: "Why this matters",
        items: [
          "Chair geometry and delivery layout directly affect clinician posture and procedure fatigue.",
          "Room-standardized units reduce training friction across multiple operatories.",
          "Utility planning and service access determine long-term uptime, not only the chair brand."
        ]
      },
      {
        type: "shop-by-type",
        title: "Shop by type",
        items: [
          {
            name: "Ambidextrous Operatory Packages",
            description: "Flexible left/right workflow setups for mixed clinician teams."
          },
          {
            name: "Specialist / Surgical Chairs",
            description: "Positioning-focused systems for longer procedures and specialist workflows."
          },
          {
            name: "Compact Room Units",
            description: "Space-efficient setups for smaller clinics and urban footprints."
          },
          {
            name: "Delivery & Assistant Modules",
            description: "Modular delivery choices, assistant instrumentation, and upgrade packs."
          }
        ]
      },
      {
        type: "selection-guide",
        title: "Selection guide",
        items: [
          "Confirm room dimensions and door access before chair shortlist.",
          "Match delivery style to procedure mix and dominant hand preference.",
          "Review stool, light, and suction integration as one workflow system.",
          "Plan service clearance and maintenance access before final placement.",
          "Standardize controls and accessories across rooms when possible."
        ]
      },
      {
        type: "cta",
        title: "Need a room-ready operatory shortlist?",
        body:
          "Share your room count, treatment mix, and preferred budget band. We will recommend chair and delivery combinations suited to your clinic setup.",
        primaryLabel: "Request a Quote",
        primaryHref: "/contact",
        secondaryLabel: "WhatsApp Enquiry",
        secondaryHref: "https://wa.me/601131313160"
      }
    ],
    featuredBrands: [
      { name: "A-dec", label: "Ergonomic operatories" },
      { name: "Stern Weber", label: "Integrated treatment units" },
      { name: "Foshan Safety", label: "Value-focused chair systems" },
      { name: "Siamdent Morita", label: "Regional chair options" }
    ],
    productFamilies: [
      "chairs-premium-integrated",
      "chairs-compact-clinic",
      "chairs-specialist-surgical",
      "chairs-ambidextrous-delivery",
      "chairs-operator-seating"
    ]
  },
  {
    slug: "imaging",
    title: "Imaging Systems",
    intro:
      "Diagnostic imaging categories for general practice and specialty planning, including intraoral capture, panoramic systems, and 3D-ready imaging workflows.",
    landingDescription: "Intraoral imaging, panoramic systems, and 3D diagnostics planning.",
    sections: [
      {
        type: "why-matters",
        title: "Why this matters",
        items: [
          "Imaging capability shapes treatment planning quality and case communication speed.",
          "Room planning, shielding, and workflow routing affect adoption as much as image quality.",
          "Scalable imaging choices reduce costly replacement cycles during clinic growth."
        ]
      },
      {
        type: "shop-by-type",
        title: "Shop by type",
        items: [
          {
            name: "Intraoral Sensors & Cameras",
            description: "Chairside image capture for diagnostics and patient education."
          },
          {
            name: "Panoramic Imaging",
            description: "Routine panoramic workflows for general and specialist clinics."
          },
          {
            name: "CBCT / 3D Imaging Platforms",
            description: "Advanced imaging for implant, surgical, and ortho planning."
          },
          {
            name: "Imaging Room Workflow Packages",
            description: "Planning support for placement, access, and clinician movement."
          }
        ]
      },
      {
        type: "selection-guide",
        title: "Selection guide",
        items: [
          "Define case scope first: general, implant, ortho, surgery, or mixed.",
          "Review FOV needs against current and planned service offerings.",
          "Plan operator access, patient positioning, and workflow routing early.",
          "Confirm software workflow and reporting expectations before commitment.",
          "Stage upgrades if 2D and 3D adoption will happen in phases."
        ]
      },
      {
        type: "cta",
        title: "Planning an imaging upgrade?",
        body:
          "We can help you compare 2D and 3D pathways based on treatment scope, room constraints, and budget timing.",
        primaryLabel: "Request a Quote",
        primaryHref: "/contact",
        secondaryLabel: "WhatsApp Enquiry",
        secondaryHref: "https://wa.me/601131313160"
      }
    ],
    featuredBrands: [
      { name: "Planmeca", label: "Pan / 3D imaging" },
      { name: "Carestream", label: "Diagnostic imaging workflows" },
      { name: "MyRay", label: "Imaging systems" },
      { name: "Stern Weber", label: "IOPA imaging" }
    ],
    productFamilies: [
      "imaging-intraoral-sensors",
      "imaging-intraoral-cameras",
      "imaging-panoramic-2d",
      "imaging-cbct-3d",
      "imaging-room-integration"
    ]
  },
  {
    slug: "sterilization",
    title: "Sterilization Systems",
    intro:
      "Sterilization and instrument reprocessing categories for compliant dirty-to-clean workflows, instrument turnover, and sterilization room planning.",
    landingDescription: "Autoclaves, thermodisinfection, packaging workflows, and reprocessing systems.",
    heroImage: eurondaE8,
    sections: [
      {
        type: "why-matters",
        title: "Why this matters",
        items: [
          "Sterilization throughput limits clinic capacity when instrument turnaround is slow.",
          "Room zoning and process flow affect consistency and audit-readiness.",
          "Correct chamber size and supporting workflow tools reduce bottlenecks and overtime."
        ]
      },
      {
        type: "shop-by-type",
        title: "Shop by type",
        items: [
          {
            name: "Benchtop Autoclaves",
            description: "Routine sterilization capacity by chamber size and cycle demand."
          },
          {
            name: "Thermodisinfectors",
            description: "Automated cleaning and disinfection to reduce manual handling."
          },
          {
            name: "Packaging & Traceability Support",
            description: "Pouches, indicators, and process labeling workflow categories."
          },
          {
            name: "Sterilization Room Layout Support",
            description: "Dirty-to-clean zoning and equipment placement planning."
          }
        ]
      },
      {
        type: "selection-guide",
        title: "Selection guide",
        items: [
          "Estimate peak daily instrument loads before choosing chamber size.",
          "Separate cleaning/disinfection and sterilization steps in room layout planning.",
          "Review drying, cycle time, and changeover impact on staff workflow.",
          "Plan packaging and monitoring consumables as part of the system.",
          "Leave service clearance and bench space for maintenance access."
        ]
      },
      {
        type: "cta",
        title: "Need a sterilization workflow review?",
        body:
          "Send your current sterilization room layout or instrument volume estimate and we will propose a reprocessing setup aligned to your clinic throughput.",
        primaryLabel: "Request a Quote",
        primaryHref: "/contact",
        secondaryLabel: "WhatsApp Enquiry",
        secondaryHref: "https://wa.me/601131313160"
      }
    ],
    featuredBrands: [
      { name: "Euronda", label: "Autoclave + reprocessing systems" },
      { name: "W&H", label: "Sterilization systems" },
      { name: "Euronda Pro System", label: "Thermodisinfection workflows" },
      { name: "Euronda Packaging", label: "Sterilization support" }
    ],
    productFamilies: [
      "steri-benchtop-autoclave-mid",
      "steri-benchtop-autoclave-high-throughput",
      "steri-thermodisinfector-compact",
      "steri-thermodisinfector-high-capacity",
      "steri-packaging-monitoring"
    ]
  },
  {
    slug: "water-filtration",
    title: "Water Filtration",
    intro:
      "Water quality and utility protection categories that support equipment longevity, treatment consistency, and reduced maintenance disruption.",
    landingDescription: "Water filtration and utility protection systems for clinic equipment reliability.",
    heroImage: eurondaAquafilter,
    sections: [
      {
        type: "why-matters",
        title: "Why this matters",
        items: [
          "Inconsistent water quality can shorten equipment life and increase service frequency.",
          "Filtration and utility planning reduce hidden downtime across multiple connected systems.",
          "Maintenance-friendly installation improves long-term serviceability."
        ]
      },
      {
        type: "shop-by-type",
        title: "Shop by type",
        items: [
          {
            name: "Chairside Water Filtration",
            description: "Point-of-use filtration for connected dental units and support systems."
          },
          {
            name: "Central Utility Protection",
            description: "System-level water treatment and protection planning for multi-room clinics."
          },
          {
            name: "Replacement Filter Programs",
            description: "Maintenance-oriented consumable replacements and service intervals."
          },
          {
            name: "Utility Integration Support",
            description: "Placement and access planning during clinic setup or renovation."
          }
        ]
      },
      {
        type: "selection-guide",
        title: "Selection guide",
        items: [
          "Review how many rooms or systems are fed by the same supply.",
          "Assess current water reliability and known quality issues.",
          "Plan replacement intervals and service access before installation.",
          "Coordinate filtration choices with sterilization and chairside equipment protection.",
          "Keep maintenance responsibilities clear for clinic operations."
        ]
      },
      {
        type: "cta",
        title: "Planning utility protection upgrades?",
        body:
          "We can recommend point-of-use or clinic-wide filtration options based on your system mix, room count, and maintenance goals.",
        primaryLabel: "Request a Quote",
        primaryHref: "/contact",
        secondaryLabel: "WhatsApp Enquiry",
        secondaryHref: "https://wa.me/601131313160"
      }
    ],
    featuredBrands: [
      { name: "Euronda", label: "Water support solutions" },
      { name: "Aquafilter", label: "Filtration systems" },
      { name: "Clinic Utility Support", label: "Integration planning" }
    ],
    productFamilies: [
      "water-chairside-filtration-single-room",
      "water-chairside-filtration-multi-room",
      "water-central-protection-module",
      "water-maintenance-replacement-set"
    ]
  },
  {
    slug: "handpieces-small-equipment",
    title: "Handpieces & Small Equipment",
    intro:
      "High-use chairside devices and accessory equipment categories that impact daily uptime, procedure flow, and replacement planning.",
    landingDescription: "High-speed, low-speed, endodontic handpieces, and chairside support devices.",
    sections: [
      {
        type: "why-matters",
        title: "Why this matters",
        items: [
          "High-use handpieces are a daily uptime risk when replacement planning is reactive.",
          "Standardization across rooms simplifies training and routine maintenance.",
          "Backup unit planning reduces disruption when core handpieces are serviced."
        ]
      },
      {
        type: "shop-by-type",
        title: "Shop by type",
        items: [
          {
            name: "High-Speed / Air-Driven",
            description: "Routine restorative and operative use handpiece categories."
          },
          {
            name: "Low-Speed & Contra-Angle",
            description: "Finishing, prophylaxis, and general procedure support options."
          },
          {
            name: "Endodontic Handpiece Systems",
            description: "Torque-controlled categories for endodontic workflows."
          },
          {
            name: "Maintenance Units & Accessories",
            description: "Cleaning, lubrication, and maintenance support systems."
          }
        ]
      },
      {
        type: "selection-guide",
        title: "Selection guide",
        items: [
          "Map handpiece selection to procedure volume, not just room count.",
          "Plan backup sets for high-usage operatories to reduce downtime.",
          "Include maintenance workflow and cleaning equipment in the shortlist.",
          "Standardize key interfaces where possible across clinicians.",
          "Review replacement cadence and service turnaround expectations."
        ]
      },
      {
        type: "cta",
        title: "Need a handpiece replacement plan?",
        body:
          "We can help you structure a replacement and backup plan by operatory, procedure volume, and maintenance workflow.",
        primaryLabel: "Request a Quote",
        primaryHref: "/contact",
        secondaryLabel: "WhatsApp Enquiry",
        secondaryHref: "https://wa.me/601131313160"
      }
    ],
    featuredBrands: [
      { name: "NSK", label: "Handpieces and maintenance systems" },
      { name: "Koungsun", label: "Chairside handpiece options" },
      { name: "Foshan Safety", label: "Value-focused accessories" }
    ],
    productFamilies: [
      "hp-high-speed-air-driven",
      "hp-low-speed-contra-angle",
      "hp-electric-handpiece-system",
      "hp-endodontic-motor-kit",
      "hp-maintenance-lubrication-unit"
    ]
  },
  {
    slug: "materials-consumables",
    title: "Dental Materials & Consumables",
    intro:
      "General clinical materials and recurring-use consumables categories covering restorative, preventive, endodontic, surgical, and everyday chairside supply needs.",
    landingDescription: "General dental materials, disposables, and high-turnover consumables categories.",
    sections: [
      {
        type: "why-matters",
        title: "Why this matters",
        items: [
          "Consumables continuity directly affects schedule reliability and chairside readiness.",
          "Category planning helps clinics avoid ad-hoc purchasing and stock duplication.",
          "Budget-tier alternatives are easier to manage when the category structure is clear."
        ]
      },
      {
        type: "shop-by-type",
        title: "Shop by type",
        items: [
          {
            name: "Restorative Materials",
            description: "Composites, adhesives, cements, and related restorative categories."
          },
          {
            name: "Endodontic & Surgical Consumables",
            description: "Root canal and procedure-support consumable categories."
          },
          {
            name: "Preventive / Hygiene Consumables",
            description: "Recall-care and routine hygiene consumable groups."
          },
          {
            name: "Disposables & Infection Control",
            description: "Daily-use PPE, barriers, and chairside disposable categories."
          }
        ]
      },
      {
        type: "selection-guide",
        title: "Selection guide",
        items: [
          "Group items by usage frequency and department before requesting quotes.",
          "Define monthly replenishment vs case-based purchasing categories.",
          "Track preferred pack sizes and substitution tolerance for key consumables.",
          "Plan backup alternatives for high-turnover items vulnerable to shortages.",
          "Standardize naming and reorder lists across branches or clinicians."
        ]
      },
      {
        type: "cta",
        title: "Want a consumables sourcing plan?",
        body:
          "Share your clinic services and approximate monthly usage. We can help structure a category-based consumables enquiry and replenishment list.",
        primaryLabel: "Request a Quote",
        primaryHref: "/contact",
        secondaryLabel: "WhatsApp Enquiry",
        secondaryHref: "https://wa.me/601131313160"
      }
    ],
    featuredBrands: [
      { name: "Euronda", label: "Disposables and sterilization support" },
      { name: "Nipro", label: "Needles and procedure support" },
      { name: "Selected Clinical Brands", label: "Category sourcing by requirement" }
    ],
    productFamilies: [
      "mat-restorative-core",
      "mat-impression-prosthetic",
      "mat-endo-consumables",
      "mat-surgical-consumables",
      "mat-preventive-hygiene",
      "mat-disposables-infection-control"
    ]
  },
  {
    slug: "orthodontic-consumables",
    title: "Orthodontic Consumables",
    intro:
      "Orthodontic chairside consumables and replenishment categories for bonding, ligation, finishing, and routine adjustment workflows.",
    landingDescription: "Orthodontic consumables for bonding, elastomerics, finishing, and chairside support.",
    sections: [
      {
        type: "why-matters",
        title: "Why this matters",
        items: [
          "Orthodontic clinics consume high volumes of repeat items that benefit from standardized reordering.",
          "Bonding and ligation categories need continuity to avoid appointment disruption.",
          "Department-level stock planning reduces missed items during busy adjustment sessions."
        ]
      },
      {
        type: "shop-by-type",
        title: "Shop by type",
        items: [
          {
            name: "Bonding Consumables",
            description: "Etchants, primers, adhesives, and setup consumables for bracket bonding."
          },
          {
            name: "Elastomerics & Ligation",
            description: "Ligatures, chains, and related adjustment appointment consumables."
          },
          {
            name: "Finishing & Debond Support",
            description: "Chairside consumables for finishing and debond procedures."
          },
          {
            name: "Daily Ortho Chairside Supplies",
            description: "Routine support consumables for high-frequency orthodontic visits."
          }
        ]
      },
      {
        type: "selection-guide",
        title: "Selection guide",
        items: [
          "Separate consumables by bonding, adjustment, and debond stages.",
          "Plan reorder cadence around chair volume and adjustment frequency.",
          "Keep backup equivalents for elastomeric and bonding categories.",
          "Standardize fast-moving chairside kits for assistants and clinicians.",
          "Track pack-size efficiency for multi-chair ortho sessions."
        ]
      },
      {
        type: "cta",
        title: "Need orthodontic replenishment support?",
        body:
          "We can help structure an orthodontic consumables list by appointment workflow and monthly usage, including bonding and adjustment categories.",
        primaryLabel: "Request a Quote",
        primaryHref: "/contact",
        secondaryLabel: "WhatsApp Enquiry",
        secondaryHref: "https://wa.me/601131313160"
      }
    ],
    featuredBrands: [
      { name: "Orthodontic Category Sourcing", label: "Workflow-based procurement" },
      { name: "Clinical Bonding Lines", label: "Bonding consumable categories" },
      { name: "Chairside Ortho Supplies", label: "Daily adjustment support" }
    ],
    productFamilies: [
      "ortho-bonding-kit-categories",
      "ortho-elastomeric-ligation",
      "ortho-finishing-debond",
      "ortho-chairside-accessories",
      "ortho-replenishment-pack"
    ]
  }
];

export const productFamilies: ProductFamily[] = [
  {
    id: "chairs-premium-integrated",
    name: "Premium Integrated Chair & Delivery Platforms",
    categorySlug: "chairs-units",
    subcategory: "Integrated operatories",
    shortDesc: "Complete operatory platforms with integrated delivery, lighting compatibility, and ergonomic workflow layout options.",
    keySpecs: ["Integrated delivery options", "Ergonomic positioning", "Room planning support"],
    tags: ["Featured", "Operatory"],
    brand: "A-dec",
    ctaType: "Request quote",
    featured: true,
    priceFrom: 95000
  },
  {
    id: "chairs-compact-clinic",
    name: "Compact Clinic Chair Systems",
    categorySlug: "chairs-units",
    subcategory: "Compact rooms",
    shortDesc: "Space-efficient chair and unit configurations for smaller treatment rooms and startup clinic footprints.",
    keySpecs: ["Compact footprint", "Utility-conscious layout", "Startup-friendly"],
    tags: ["Space-saving", "Clinic startup"],
    brand: "Foshan Safety",
    ctaType: "Request quote",
    priceFrom: 42000
  },
  {
    id: "chairs-specialist-surgical",
    name: "Specialist / Surgical Positioning Chairs",
    categorySlug: "chairs-units",
    subcategory: "Specialist chairs",
    shortDesc: "Advanced positioning configurations for specialist procedures and longer treatment sessions.",
    keySpecs: ["Advanced positioning", "Long procedure support", "Specialist workflow"],
    tags: ["Specialist", "Procedure comfort"],
    brand: "Stern Weber",
    ctaType: "Learn more",
    priceFrom: 120000
  },
  {
    id: "chairs-ambidextrous-delivery",
    name: "Ambidextrous Delivery Configurations",
    categorySlug: "chairs-units",
    subcategory: "Delivery systems",
    shortDesc: "Left/right flexible delivery configurations for mixed clinician teams and shared rooms.",
    keySpecs: ["Left-right flexibility", "Shared room setup", "Operator preference support"],
    tags: ["Ambidextrous", "Delivery"],
    brand: "A-dec",
    ctaType: "Request quote",
    featured: true
  },
  {
    id: "chairs-operator-seating",
    name: "Operator & Assistant Seating Packages",
    categorySlug: "chairs-units",
    subcategory: "Seating",
    shortDesc: "Ergonomic seating and assistant support pairings matched to operatory configurations.",
    keySpecs: ["Ergonomic support", "Assistant access", "Operatory pairing"],
    tags: ["Ergonomics", "Accessory"],
    ctaType: "Learn more"
  },
  {
    id: "imaging-intraoral-sensors",
    name: "Intraoral Sensor Categories",
    categorySlug: "imaging",
    subcategory: "Intraoral sensors",
    shortDesc: "Chairside sensor categories for diagnostic imaging workflows and patient communication.",
    keySpecs: ["Chairside diagnostics", "Workflow integration", "General practice use"],
    tags: ["Sensor", "Diagnostic"],
    brand: "Carestream",
    ctaType: "Request quote",
    featured: true,
    priceFrom: 18000
  },
  {
    id: "imaging-intraoral-cameras",
    name: "Intraoral Camera Systems",
    categorySlug: "imaging",
    subcategory: "Intraoral cameras",
    shortDesc: "Image capture systems for patient education, documentation, and chairside communication.",
    keySpecs: ["Patient education", "Chairside imaging", "Documentation support"],
    tags: ["Camera", "Chairside"],
    brand: "Planmeca",
    ctaType: "Learn more"
  },
  {
    id: "imaging-panoramic-2d",
    name: "Panoramic 2D Imaging Platforms",
    categorySlug: "imaging",
    subcategory: "Panoramic imaging",
    shortDesc: "Panoramic imaging categories for routine diagnostics and general clinic workflows.",
    keySpecs: ["2D panoramic", "General diagnostics", "Room planning required"],
    tags: ["Panoramic", "2D"],
    brand: "MyRay",
    ctaType: "Request quote",
    priceFrom: 85000
  },
  {
    id: "imaging-cbct-3d",
    name: "CBCT / 3D Imaging Categories",
    categorySlug: "imaging",
    subcategory: "3D imaging",
    shortDesc: "3D imaging categories for implant, surgery, and advanced treatment planning workflows.",
    keySpecs: ["3D planning", "FOV selection", "Specialist workflows"],
    tags: ["CBCT", "3D", "Advanced"],
    brand: "Planmeca",
    ctaType: "Request quote",
    featured: true,
    priceFrom: 220000
  },
  {
    id: "imaging-room-integration",
    name: "Imaging Room Integration Packages",
    categorySlug: "imaging",
    subcategory: "Room integration",
    shortDesc: "Planning support bundles for placement, access routes, and room readiness around imaging systems.",
    keySpecs: ["Workflow planning", "Room layout", "Installation readiness"],
    tags: ["Planning", "Integration"],
    ctaType: "Learn more"
  },
  {
    id: "steri-benchtop-autoclave-mid",
    name: "Benchtop Autoclaves (Mid Capacity)",
    categorySlug: "sterilization",
    subcategory: "Autoclaves",
    shortDesc: "Daily-use sterilization systems sized for routine clinic throughput and instrument turnover.",
    keySpecs: ["Benchtop class", "Routine throughput", "Clinic-ready cycles"],
    tags: ["Autoclave", "Featured"],
    brand: "Euronda",
    image: eurondaE8,
    ctaType: "Request quote",
    featured: true,
    priceFrom: 24000
  },
  {
    id: "steri-benchtop-autoclave-high-throughput",
    name: "Benchtop Autoclaves (High Throughput)",
    categorySlug: "sterilization",
    subcategory: "Autoclaves",
    shortDesc: "Higher-capacity sterilization categories for growing clinics or instrument-heavy schedules.",
    keySpecs: ["Higher chamber capacity", "Throughput-focused", "Reprocessing workflow"],
    tags: ["Autoclave", "High throughput"],
    brand: "W&H",
    ctaType: "Request quote",
    priceFrom: 36000
  },
  {
    id: "steri-thermodisinfector-compact",
    name: "Thermodisinfectors (Compact Workflow)",
    categorySlug: "sterilization",
    subcategory: "Thermodisinfection",
    shortDesc: "Automated cleaning/disinfection categories for clinics adding structured reprocessing steps.",
    keySpecs: ["Automated cleaning", "Compact installation", "Workflow consistency"],
    tags: ["Thermodisinfection", "Automation"],
    brand: "Euronda",
    image: eurondaThermodisinfectors,
    ctaType: "Learn more",
    featured: true
  },
  {
    id: "steri-thermodisinfector-high-capacity",
    name: "Thermodisinfectors (High Capacity)",
    categorySlug: "sterilization",
    subcategory: "Thermodisinfection",
    shortDesc: "Higher-capacity automated cleaning/disinfection categories for multi-room clinics.",
    keySpecs: ["Higher basket capacity", "Throughput improvement", "Reduced manual handling"],
    tags: ["Thermodisinfection", "High capacity"],
    brand: "Euronda Pro System",
    ctaType: "Request quote"
  },
  {
    id: "steri-packaging-monitoring",
    name: "Sterilization Packaging & Monitoring Support",
    categorySlug: "sterilization",
    subcategory: "Packaging and monitoring",
    shortDesc: "Pouch, indicator, and monitoring workflow categories to support reprocessing consistency.",
    keySpecs: ["Pouches and reels", "Indicators", "Traceability support"],
    tags: ["Packaging", "Monitoring"],
    ctaType: "Learn more"
  },
  {
    id: "water-chairside-filtration-single-room",
    name: "Chairside Water Filtration (Single Room)",
    categorySlug: "water-filtration",
    subcategory: "Chairside filtration",
    shortDesc: "Point-of-use filtration categories for individual room equipment protection and water consistency.",
    keySpecs: ["Point-of-use", "Equipment protection", "Single-room setup"],
    tags: ["Filtration", "Chairside"],
    image: eurondaAquafilter,
    brand: "Euronda",
    ctaType: "Request quote",
    featured: true,
    priceFrom: 3800
  },
  {
    id: "water-chairside-filtration-multi-room",
    name: "Chairside Water Filtration (Multi Room Program)",
    categorySlug: "water-filtration",
    subcategory: "Chairside filtration",
    shortDesc: "Multi-room filtration planning and replacement programs for standardized clinic support.",
    keySpecs: ["Multi-room planning", "Replacement scheduling", "Standardization"],
    tags: ["Filtration", "Program"],
    brand: "Aquafilter",
    ctaType: "Learn more"
  },
  {
    id: "water-central-protection-module",
    name: "Central Utility Protection Modules",
    categorySlug: "water-filtration",
    subcategory: "Central utility protection",
    shortDesc: "Centralized filtration/protection categories for clinics with shared utility support planning.",
    keySpecs: ["Central utility", "Multi-system support", "Service access planning"],
    tags: ["Utility", "Central"],
    ctaType: "Request quote"
  },
  {
    id: "water-maintenance-replacement-set",
    name: "Filter Replacement & Maintenance Sets",
    categorySlug: "water-filtration",
    subcategory: "Maintenance consumables",
    shortDesc: "Replacement sets and maintenance consumables supporting long-term filtration performance.",
    keySpecs: ["Replacement cycles", "Maintenance planning", "Service continuity"],
    tags: ["Maintenance", "Consumables"],
    ctaType: "Learn more"
  },
  {
    id: "hp-high-speed-air-driven",
    name: "High-Speed Handpieces (Air Driven)",
    categorySlug: "handpieces-small-equipment",
    subcategory: "High-speed handpieces",
    shortDesc: "Routine high-speed handpiece categories for restorative and operative workflows.",
    keySpecs: ["Air driven", "Daily-use workflow", "Operatory rotation"],
    tags: ["High speed", "Featured"],
    brand: "NSK",
    ctaType: "Request quote",
    featured: true,
    priceFrom: 1600
  },
  {
    id: "hp-low-speed-contra-angle",
    name: "Low-Speed / Contra-Angle Sets",
    categorySlug: "handpieces-small-equipment",
    subcategory: "Low-speed systems",
    shortDesc: "Low-speed and contra-angle categories for finishing and routine chairside support.",
    keySpecs: ["Contra-angle", "Low-speed", "Chairside support"],
    tags: ["Low speed", "General"],
    brand: "Koungsun",
    ctaType: "Learn more",
    priceFrom: 950
  },
  {
    id: "hp-electric-handpiece-system",
    name: "Electric Handpiece System Categories",
    categorySlug: "handpieces-small-equipment",
    subcategory: "Electric handpieces",
    shortDesc: "Electric handpiece categories for clinicians seeking power consistency and workflow control.",
    keySpecs: ["Electric drive", "Power consistency", "Advanced workflow"],
    tags: ["Electric", "Performance"],
    brand: "NSK",
    ctaType: "Request quote"
  },
  {
    id: "hp-endodontic-motor-kit",
    name: "Endodontic Motor & Handpiece Kits",
    categorySlug: "handpieces-small-equipment",
    subcategory: "Endodontic handpieces",
    shortDesc: "Endodontic motor and handpiece category options for torque-controlled endo workflows.",
    keySpecs: ["Endo workflow", "Torque control", "Chairside integration"],
    tags: ["Endodontic", "Motor kit"],
    ctaType: "Request quote",
    featured: true
  },
  {
    id: "hp-maintenance-lubrication-unit",
    name: "Handpiece Maintenance & Lubrication Units",
    categorySlug: "handpieces-small-equipment",
    subcategory: "Maintenance units",
    shortDesc: "Maintenance equipment categories for cleaning and lubrication workflow standardization.",
    keySpecs: ["Cleaning workflow", "Lubrication", "Maintenance standardization"],
    tags: ["Maintenance", "Support"],
    ctaType: "Learn more"
  },
  {
    id: "mat-restorative-core",
    name: "Restorative Materials (Core Categories)",
    categorySlug: "materials-consumables",
    subcategory: "Restorative materials",
    shortDesc: "Category sourcing for composites, adhesives, cements, and restorative workflow essentials.",
    keySpecs: ["Composites", "Adhesives", "Cements"],
    tags: ["Restorative", "High turnover"],
    ctaType: "Request quote",
    featured: true
  },
  {
    id: "mat-impression-prosthetic",
    name: "Impression & Prosthetic Materials",
    categorySlug: "materials-consumables",
    subcategory: "Impression materials",
    shortDesc: "Category coverage for alginate, VPS, and bite registration material needs.",
    keySpecs: ["Alginate", "VPS", "Bite registration"],
    tags: ["Impression", "Prosthetic"],
    ctaType: "Learn more"
  },
  {
    id: "mat-endo-consumables",
    name: "Endodontic Consumables Categories",
    categorySlug: "materials-consumables",
    subcategory: "Endodontic consumables",
    shortDesc: "Consumable categories for irrigation, obturation, sealers, and endodontic support materials.",
    keySpecs: ["Obturation", "Irrigation", "Sealers"],
    tags: ["Endodontic", "Procedure support"],
    ctaType: "Request quote"
  },
  {
    id: "mat-surgical-consumables",
    name: "Surgical & Implant Consumables",
    categorySlug: "materials-consumables",
    subcategory: "Surgical consumables",
    shortDesc: "Procedure support consumable categories for oral surgery and implant workflows.",
    keySpecs: ["Drapes", "Sutures", "Procedure setup"],
    tags: ["Surgical", "Implant"],
    ctaType: "Learn more"
  },
  {
    id: "mat-preventive-hygiene",
    name: "Preventive & Hygiene Consumables",
    categorySlug: "materials-consumables",
    subcategory: "Preventive and hygiene",
    shortDesc: "High-frequency hygiene and preventive consumable categories for recurring appointments.",
    keySpecs: ["Preventive", "Hygiene", "Chairside turnover"],
    tags: ["Preventive", "Hygiene"],
    ctaType: "Request quote",
    featured: true
  },
  {
    id: "mat-disposables-infection-control",
    name: "Disposables & Infection Control Consumables",
    categorySlug: "materials-consumables",
    subcategory: "Disposables and PPE",
    shortDesc: "PPE, barriers, and daily-use disposable categories for clinic operations and infection control.",
    keySpecs: ["PPE", "Barriers", "Daily-use disposables"],
    tags: ["Disposables", "Infection control"],
    brand: "Euronda",
    ctaType: "Request quote",
    priceFrom: 200
  },
  {
    id: "ortho-bonding-kit-categories",
    name: "Orthodontic Bonding Consumable Categories",
    categorySlug: "orthodontic-consumables",
    subcategory: "Bonding consumables",
    shortDesc: "Bonding category support for etchants, primers, adhesives, and bracket placement workflow consumables.",
    keySpecs: ["Etchant", "Primer", "Adhesive support"],
    tags: ["Orthodontic", "Bonding"],
    ctaType: "Request quote",
    featured: true
  },
  {
    id: "ortho-elastomeric-ligation",
    name: "Elastomerics & Ligation Consumables",
    categorySlug: "orthodontic-consumables",
    subcategory: "Elastomerics and ligation",
    shortDesc: "Elastomeric ligatures, chains, and adjustment appointment consumable categories.",
    keySpecs: ["Ligatures", "Chains", "Adjustment support"],
    tags: ["Orthodontic", "Elastomerics"],
    ctaType: "Request quote",
    priceFrom: 120
  },
  {
    id: "ortho-finishing-debond",
    name: "Finishing & Debond Consumables",
    categorySlug: "orthodontic-consumables",
    subcategory: "Finishing and debond",
    shortDesc: "Chairside consumable categories used during finishing and debond workflows.",
    keySpecs: ["Finishing support", "Debond setup", "Chairside workflow"],
    tags: ["Orthodontic", "Debond"],
    ctaType: "Learn more"
  },
  {
    id: "ortho-chairside-accessories",
    name: "Daily Ortho Chairside Supply Categories",
    categorySlug: "orthodontic-consumables",
    subcategory: "Chairside accessories",
    shortDesc: "Routine chairside support consumable categories for high-frequency orthodontic visits.",
    keySpecs: ["Chairside support", "Daily use", "Assistant workflow"],
    tags: ["Orthodontic", "Chairside"],
    ctaType: "Learn more"
  },
  {
    id: "ortho-replenishment-pack",
    name: "Orthodontic Replenishment Planning Bundles",
    categorySlug: "orthodontic-consumables",
    subcategory: "Replenishment planning",
    shortDesc: "Category-based replenishment planning support for recurring ortho consumable needs.",
    keySpecs: ["Reorder planning", "Usage-based sourcing", "Clinic continuity"],
    tags: ["Orthodontic", "Replenishment"],
    ctaType: "Request quote",
    featured: true
  }
];

export const getProductCategoryBySlug = (slug: string) =>
  productCategories.find((category) => category.slug === slug);

export const getProductFamiliesForCategory = (categorySlug: string) =>
  productFamilies.filter((family) => family.categorySlug === categorySlug);

export const productCategorySidebarLinks = productCategories.map((category) => ({
  slug: category.slug,
  title: category.title
}));
