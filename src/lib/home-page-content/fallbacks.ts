import type { HomePageContent } from './types'

/** Default homepage content — aligned with live hdp.com.eg marketing copy + local assets. */
export const HOME_PAGE_FALLBACKS: HomePageContent = {
  hero: {
    titleLine1: { en: 'Housing and Development', ar: 'الإسكان والتطوير' },
    titleLine2: { en: 'Properties', ar: 'العقاري' },
    description: {
      en: 'Spaces that inspire and comfort you',
      ar: 'مساحات تلهمك وتليق براحتك',
    },
    video: {
      projectId: 'hdp-home',
      projectName: 'HDP',
      projectNameAr: 'HDP',
      videoUrl: '/videos/banner.mp4',
      coverImageUrl: '/hdp-live/sec_img.jpg',
      aspectRatio: 16 / 9,
    },
    fallbackVideoUrl: '/videos/banner.mp4',
  },
  inspiringSpaces: {
    title: { en: 'Who Are We', ar: 'من نحن' },
    description: {
      en: 'Driven by an ever-evolving spirit, HDP Properties has become a leading Egyptian developer, known for its innovation and excellence.',
      ar: 'بروح متجددة باستمرار، أصبحت HDP Properties مطوراً مصرياً رائداً يُعرف بالابتكار والتميز.',
    },
    imageUrl: '/hdp-live/sec_img.jpg',
  },
  stats: {
    title: { en: 'A legacy of pride', ar: 'إرث من الفخر' },
    description: {
      en: 'HDP leverages the Housing and Development Bank’s four decades legacy, acting as its real estate investment and development arm.',
      ar: 'تستند HDP إلى إرث بنك الإسكان والتعمير الممتد لأربعة عقود، وتعمل كذراع استثمار وتطوير عقاري له.',
    },
    staticStats: [
      {
        id: 'projects',
        value: 10,
        suffix: '+',
        label: { en: 'Developments', ar: 'مشاريع' },
      },
      {
        id: 'years',
        value: 4,
        suffix: '+',
        label: { en: 'Years of Excellence', ar: 'سنوات من التميز' },
      },
    ],
  },
  ourFields: {
    title: { en: 'Our Developments', ar: 'مشاريعنا' },
    readMoreLabel: { en: 'Explore →', ar: 'استكشف ←' },
    cards: [
      {
        id: 'residential',
        imageUrl: '/hdp-live/east.jpg',
        title: { en: 'East Cairo', ar: 'شرق القاهرة' },
        description: {
          en: 'Flagship communities across New Cairo and Mostakbal City — Talda, SQ1, The Gray, Grand Lane, and more.',
          ar: 'مجتمعات رائدة في القاهرة الجديدة ومدينة المستقبل — تالدا وSQ1 وذا جراي وجراند لين والمزيد.',
        },
        link: '/projects',
      },
      {
        id: 'commercial',
        imageUrl: '/hdp-live/west.jpg',
        title: { en: 'West Cairo', ar: 'غرب القاهرة' },
        description: {
          en: 'Landmark living in Sheikh Zayed and 6th of October — Terrace, Westview Residence, Club Hills, and Terrace Plaza.',
          ar: 'حياة مميزة في الشيخ زايد و6 أكتوبر — تراس وويست فيو وكلوب هيلز وتراس بلازا.',
        },
        link: '/projects',
      },
    ],
  },
  aboutProjects: {
    title: { en: 'About\nOur Projects', ar: 'عن مشاريعنا' },
  },
  cma: {
    imageUrl: '/hdp-live/hdb-light.png',
    description: {
      en: 'HDP is the real estate investment and development arm of the Housing and Development Bank, delivering bespoke residential and mixed-use offerings in prime Egyptian locations.',
      ar: 'HDP هي ذراع الاستثمار والتطوير العقاري لبنك الإسكان والتعمير، وتقدم عروضاً سكنية ومتعددة الاستخدامات في مواقع مميزة بمصر.',
    },
    teaser: {
      en: 'We believe in creating spaces that inspire and communities that thrive.',
      ar: 'نؤمن بصناعة مساحات تلهم ومجتمعات تزدهر.',
    },
    ctaLabel: { en: 'Who Are We', ar: 'من نحن' },
    ctaLink: '/about',
  },
  cta: {
    title: { en: 'We are pleased to hear from you', ar: 'يسعدنا تواصلكم معنا' },
    description: {
      en: 'Register your interest and our team will help you find the right home or investment.',
      ar: 'سجّل اهتمامك وسيساعدك فريقنا في اختيار المنزل أو الاستثمار المناسب.',
    },
    buttonLabel: { en: 'Enquire Now', ar: 'استفسر الآن' },
  },
}
