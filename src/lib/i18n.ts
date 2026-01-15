export type Language = 'en' | 'is';

type TranslationValue = string | string[] | TranslationTree;
type TranslationTree = Record<string, TranslationValue>;

export const translations: Record<Language, TranslationTree> = {
  en: {
    home: {
      title: 'Find your learning path with Vegvisr',
      subtitle: 'Answer a few questions so we can tailor your onboarding experience.',
      chooseAuth: 'Choose how you want to sign in',
      google: 'Continue with Google',
      email: 'Continue with email',
      emailPlaceholder: 'Enter your email address',
      sendLink: 'Send magic link',
      linkSent: 'Magic link sent. Check your inbox.',
      language: 'Language'
    },
    auth: {
      verifying: 'Verifying your access...',
      success: 'You are verified. Redirecting to onboarding.',
      failure: 'We could not verify that link. Request a new one.',
      callbackError: 'We could not complete Google sign-in. Try again.'
    },
    onboarding: {
      title: 'Your Vegvisr onboarding',
      step: 'Step',
      of: 'of',
      next: 'Next step',
      back: 'Back',
      submit: 'Submit onboarding',
      saving: 'Saving progress...',
      saved: 'All changes saved',
      successTitle: 'You are all set!',
      successBody: 'We have received your onboarding responses.',
      questions: {
        name: 'Full name',
        age: 'Age',
        education: 'Highest education level',
        employment: 'Current employment status',
        location: 'Location'
      },
      learning: {
        motivation: 'What motivates you to learn right now?',
        experience: 'Describe your prior experience with learning online',
        time: 'How many hours per week can you commit?',
        preferences: 'Preferred learning style'
      },
      interests: {
        title: 'Select your interests',
        description: 'Pick the topics that excite you most.',
        topics: [
          'Data literacy',
          'AI fundamentals',
          'Product design',
          'Service design',
          'Sustainability',
          'Leadership',
          'Project management',
          'Business strategy',
          'Creative coding',
          'Storytelling',
          'Marketing growth',
          'UX research',
          'Entrepreneurship',
          'Fintech',
          'Wellness'
        ]
      }
    },
    common: {
      loading: 'Loading...',
      emailLabel: 'Email address',
      required: 'This field is required',
      tryAgain: 'Try again',
      signOut: 'Use a different email',
      autosaveHint: 'Progress saves automatically.'
    }
  },
  is: {
    home: {
      title: 'Finndu þína leið með Vegvisr',
      subtitle: 'Svaraðu nokkrum spurningum svo við getum sérsniðið onboarding.',
      chooseAuth: 'Veldu hvernig þú vilt skrá þig inn',
      google: 'Halda áfram með Google',
      email: 'Halda áfram með netfangi',
      emailPlaceholder: 'Sláðu inn netfangið þitt',
      sendLink: 'Senda töfrahlekk',
      linkSent: 'Töfrahlekkur sendur. Athugaðu pósthólfið.',
      language: 'Tungumál'
    },
    auth: {
      verifying: 'Staðfestum aðgang...',
      success: 'Þú ert staðfest(ur). Flyt á onboarding.',
      failure: 'Við gátum ekki staðfest hlekkinn. Biddu um nýjan.',
      callbackError: 'Google innskráning mistókst. Reyndu aftur.'
    },
    onboarding: {
      title: 'Vegvisr onboarding',
      step: 'Skref',
      of: 'af',
      next: 'Næsta skref',
      back: 'Til baka',
      submit: 'Senda onboarding',
      saving: 'Vista framvindu...',
      saved: 'Allt vistað',
      successTitle: 'Allt klárt!',
      successBody: 'Við höfum móttekið svörin þín.',
      questions: {
        name: 'Fullt nafn',
        age: 'Aldur',
        education: 'Hæsta menntunarstig',
        employment: 'Atvinna núna',
        location: 'Staðsetning'
      },
      learning: {
        motivation: 'Hvað hvetur þig til að læra núna?',
        experience: 'Lýstu fyrri reynslu af netnámi',
        time: 'Hversu margar klst. á viku getur þú varið?',
        preferences: 'Uppáhalds námsstíll'
      },
      interests: {
        title: 'Veldu áhugasvið',
        description: 'Veldu þau efni sem heilla þig mest.',
        topics: [
          'Gagnalæsi',
          'Grunnatriði gervigreindar',
          'Hönnun vara',
          'Þjónustuhönnun',
          'Sjálfbærni',
          'Leiðtogahæfni',
          'Verkefnastjórnun',
          'Viðskiptastefna',
          'Skapandi kóðun',
          'Frásagnalist',
          'Markaðsvöxtur',
          'UX rannsóknir',
          'Frumkvöðlastarf',
          'Fjártækni',
          'Heilsa og vellíðan'
        ]
      }
    },
    common: {
      loading: 'Hleð...',
      emailLabel: 'Netfang',
      required: 'Þetta reit er nauðsynlegur',
      tryAgain: 'Reyndu aftur',
      signOut: 'Nota annað netfang',
      autosaveHint: 'Framvinda vistast sjálfkrafa.'
    }
  }
};

export const getInterestTopics = (language: Language) => {
  const interests = translations[language].onboarding as TranslationTree;
  const topicValue = (interests?.interests as TranslationTree)?.topics;
  return Array.isArray(topicValue) ? topicValue : [];
};

export const getTranslation = (language: Language, key: string): string => {
  const parts = key.split('.');
  let node: TranslationValue | undefined = translations[language];
  for (const part of parts) {
    if (!node || typeof node === 'string' || Array.isArray(node)) {
      return key;
    }
    node = node[part];
  }
  return typeof node === 'string' ? node : key;
};
