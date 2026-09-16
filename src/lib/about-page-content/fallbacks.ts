import { boardMembers, type BoardMember } from '../about/content'
import type { AboutBoardMember, AboutCompanyValue, AboutPageContent } from './types'

const BOARD_TREE_ORDER: Record<string, number> = {
  tariq: 1,
  faisal: 2,
  osama: 3,
  alrashidi: 4,
  alfuraidi: 5,
}

const BOARD_SLUGS = ['tariq', 'faisal', 'osama', 'alrashidi', 'alfuraidi'] as const

function slugForMember(member: BoardMember): string | null {
  const image = member.image.toLowerCase()
  if (image.includes('tariq')) return 'tariq'
  if (image.includes('faisal')) return 'faisal'
  if (image.includes('osama') || image.includes('ussama') || image.includes('dawlty')) return 'osama'
  if (image.includes('rashid')) return 'alrashidi'
  if (image.includes('saleh') || image.includes('furaidi')) return 'alfuraidi'
  return null
}

function buildFallbackBoardMembers(): AboutBoardMember[] {
  const bySlug = new Map<string, AboutBoardMember>()

  for (const member of boardMembers) {
    const slug = slugForMember(member)
    if (!slug) continue

    bySlug.set(slug, {
      id: slug,
      name: { en: member.nameEn, ar: member.nameAr },
      title: { en: member.titleEn, ar: member.titleAr },
      description: { en: member.descriptionEn, ar: member.descriptionAr },
      imageUrl: member.image,
      displayOrder: BOARD_TREE_ORDER[slug],
      active: true,
    })
  }

  return BOARD_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (member): member is AboutBoardMember => Boolean(member)
  )
}

const visionEn = [
  'To be the leading real estate developer in Egypt, setting new standards for innovation, quality, and community building.',
]

const visionAr = [
  'أن نكون المطوّر العقاري الرائد في مصر، واضعين معايير جديدة للابتكار والجودة وبناء المجتمعات.',
]

const missionEn = [
  'Carving a lasting legacy of unprecedented quality and added value by harnessing the power of creativity through forward communities.',
  'Deliver bespoke residential and mixed-use offerings in prime locations across Egypt.',
  'Act as the real estate investment and development arm of the Housing and Development Bank.',
  'Create flexible investment opportunities that meet diverse market needs.',
  'We believe in creating spaces that inspire and communities that thrive, driven by innovation and guided by our commitment to excellence.',
]

const missionAr = [
  'صناعة إرث دائم من الجودة والقيمة المضافة عبر الإبداع وبناء مجتمعات متقدمة.',
  'تقديم عروض سكنية ومتعددة الاستخدامات مميزة في مواقع رئيسية بأنحاء مصر.',
  'العمل كذراع الاستثمار والتطوير العقاري لبنك الإسكان والتعمير.',
  'ابتكار فرص استثمارية مرنة تلبي احتياجات السوق المتنوعة.',
  'نؤمن بصناعة مساحات تلهم ومجتمعات تزدهر، مدفوعة بالابتكار وملتزمة بالتميز.',
]

/** Default About page content when Salesforce has no matching PWA_Content__c records. */
export const ABOUT_PAGE_FALLBACKS: AboutPageContent = {
  vision: {
    title: { en: 'Our Vision', ar: 'الرؤية' },
    paragraphs: visionEn.map((en, index) => ({
      en,
      ar: visionAr[index] || en,
    })),
    displayOrder: 1,
  },
  mission: {
    title: { en: 'Our Mission', ar: 'الرسالة' },
    items: missionEn.map((en, index) => ({
      en,
      ar: missionAr[index] || en,
    })),
    displayOrder: 2,
  },
  boardMembers: buildFallbackBoardMembers(),
  companyValues: [] as AboutCompanyValue[],
}

export { BOARD_SLUGS, BOARD_TREE_ORDER }
