/** English interface text. Keys are grouped by screen; `{name}` placeholders are filled by `t()`. */
export const en = {
  'app.name': 'Darsan',
  'app.tagline': 'Temple darshan and vazhipadu booking',
  'nav.main': 'Main',
  'nav.home': 'Home',
  'nav.skipToContent': 'Skip to main content',
  'footer.note': 'Demo app with mock data. No real bookings or payments are made.',
  'footer.credits': 'Photo credits',

  'common.loading': 'Loading…',
  'common.tryAgain': 'Try again',
  'common.close': 'Close',
  'common.errorTitle': 'Something went wrong',

  'home.heroTitle': 'Book darshan and offerings at Kerala temples',
  'home.heroText': 'Choose a temple, pick a darshan slot or an offering, and get a confirmation in minutes.',
  'home.servicesTitle': 'Services',
  'home.comingSoon': 'Coming soon',

  'notFound.title': 'Page not found',
  'notFound.text': 'The page you are looking for does not exist or has moved.',
  'notFound.home': 'Go to home',
} as const

export type MessageKey = keyof typeof en
export type Dictionary = Record<MessageKey, string>
