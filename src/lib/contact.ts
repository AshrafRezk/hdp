/** Shared company contact links — HDP Egypt. */
export const COMPANY_PHONE_DISPLAY = '19845'
export const COMPANY_PHONE_TEL = 'tel:19845'
export const COMPANY_WHATSAPP_URL = 'https://wa.me/201070002592'
export const COMPANY_EMAIL = 'info@hdp.com.eg'
export const COMPANY_EMAIL_HREF = 'mailto:info@hdp.com.eg'

export const COMPANY_OFFICES = [
  {
    id: 'sheikh-zayed',
    nameEn: 'Sheikh Zayed Office',
    nameAr: 'مكتب الشيخ زايد',
    linesEn: [
      'Building B1, 5th Floor – Majarrah',
      '26th of July Corridor, Al Sheikh Zayed – Giza',
    ],
    linesAr: [
      'المبنى B1، الطابق الخامس – مجرة',
      'محور 26 يوليو، الشيخ زايد – الجيزة',
    ],
  },
  {
    id: 'new-cairo',
    nameEn: 'New Cairo Office',
    nameAr: 'مكتب القاهرة الجديدة',
    linesEn: ['Eastwalk, Building B4, 3rd floor, New Cairo, Cairo, Egypt.'],
    linesAr: ['إيست ووك، المبنى B4، الطابق الثالث، القاهرة الجديدة، مصر.'],
  },
  {
    id: 'north-coast',
    nameEn: 'North Coast Sales Office',
    nameAr: 'مكتب مبيعات الساحل الشمالي',
    linesEn: ['Next to Marina 5 Gate, Egypt.'],
    linesAr: ['بجوار بوابة مارينا 5، مصر.'],
  },
] as const

export const COMPANY_SOCIALS = [
  {
    id: 'instagram',
    href: 'https://www.instagram.com/hdp_egypt/',
    labelEn: 'Instagram',
    labelAr: 'إنستغرام',
  },
  {
    id: 'facebook',
    href: 'https://www.facebook.com/hdpeg',
    labelEn: 'Facebook',
    labelAr: 'فيسبوك',
  },
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/company/hdp-egypt',
    labelEn: 'LinkedIn',
    labelAr: 'لينكدإن',
  },
  {
    id: 'whatsapp',
    href: COMPANY_WHATSAPP_URL,
    labelEn: 'WhatsApp',
    labelAr: 'واتساب',
  },
] as const
