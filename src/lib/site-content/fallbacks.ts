import type { NavLabelKey, SiteContent } from './types'

const NAV_FALLBACKS: Record<NavLabelKey, { en: string; ar: string }> = {
  home: { en: 'Home', ar: 'الرئيسية' },
  search: { en: 'Unit Search', ar: 'بحث الوحدات' },
  aboutUs: { en: 'Who Are We', ar: 'من نحن' },
  achievements: { en: 'Our Achievements', ar: 'إنجازاتنا' },
  community: { en: 'My Community', ar: 'مجتمعي' },
  contact: { en: 'Contact Us', ar: 'تواصل معنا' },
  support: { en: 'Support', ar: 'الدعم' },
  latestReleases: { en: 'Projects', ar: 'المشاريع' },
  ourNews: { en: 'Media Center', ar: 'المركز الإعلامي' },
  more: { en: 'More', ar: 'المزيد' },
  call: { en: 'Call', ar: 'اتصال' },
  commercial: { en: 'Commercial & Rental', ar: 'التجاري والتأجير' },
  projects: { en: 'Projects', ar: 'المشاريع' },
  mediaCenter: { en: 'Media Center', ar: 'المركز الإعلامي' },
  careers: { en: 'Careers', ar: 'الوظائف' },
  ourTeam: { en: 'Our Team', ar: 'فريقنا' },
}

/** Default site copy when Salesforce has no matching PWA_Content__c records. */
export const SITE_CONTENT_FALLBACKS: SiteContent = {
  latestReleases: {
    title: { en: 'Projects', ar: 'المشاريع' },
    subtitle: {
      en: 'Explore our portfolio of residential and mixed-use developments across Egypt.',
      ar: 'استكشف محفظتنا من المشاريع السكنية ومتعددة الاستخدامات في أنحاء مصر.',
    },
  },
  contact: {
    title: { en: 'Contact Us', ar: 'تواصل معنا' },
    subtitle: {
      en: "We're pleased to hear from you.",
      ar: 'يسعدنا تواصلكم معنا.',
    },
  },
  commercial: {
    title: { en: 'Empower Your Business', ar: 'طوّر أعمالك' },
    subtitle: {
      en: 'Premium Commercial & Rental Spaces',
      ar: 'مساحات تجارية وعقارات تأجير متميزة',
    },
  },
  navigation: NAV_FALLBACKS,
}

export { NAV_FALLBACKS }
