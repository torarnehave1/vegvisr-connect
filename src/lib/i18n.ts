export type Language = 'en' | 'is' | 'no' | 'nl';

type TranslationValue = string | string[] | TranslationTree;
type TranslationTree = Record<string, TranslationValue>;

export const translations: Record<Language, TranslationTree> = {
  en: {
    home: {
      title: 'Find your learning path with Vegvisr',
      subtitle: 'Answer a few questions so we can tailor your onboarding experience.',
      chooseAuth: 'Enter your email to get a magic link',
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
      successTitle: 'You are all set, You rock!',
      successBody: 'We have received your onboarding responses. We will review them and get back to you soon. The timeframe for review may vary based on the volume of submissions. But we will do our best to get back to you as soon as possible.',
      successMomentum:
        'Momentum is a weekly one-hour stream for people who want to grow in system development and coding.',
      questions: {
        name: 'Full name',
        age: 'Age',
        education: 'Highest education level',
        employment: 'Current employment status',
        location: 'Location'
      },
      learning: {
        motivation: 'What motivates you to learn right now?',
        motivationHelp: 'Pick the option that feels closest to you.',
        motivationOptions: [
          'I want a structured learning path',
          'I need accountability and momentum',
          'I want to change careers or level up',
          'I am exploring new ideas and tools'
        ],
        experience: 'Describe your prior experience with learning online',
        experienceHelp: 'Choose the statement that best matches your experience.',
        experienceOptions: [
          'I am new to online learning',
          'I have tried a few courses',
          'I learn online regularly',
          'I mentor or teach others online'
        ],
        time: 'How many hours per week can you commit?',
        timeHelp: 'This helps us design a realistic pace.',
        timeOptions: ['1-3 hours', '3-5 hours', '5-8 hours', '8+ hours'],
        preferences: 'Preferred learning style'
        ,
        preferencesHelp: 'Select the style that keeps you engaged.',
        preferencesOptions: [
          'Hands-on projects',
          'Short lessons with practice',
          'Deep dives with reading',
          'Group learning and feedback'
        ],
        detailPrompt: 'Add details or edit your selection (optional)'
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
      },
      momentum: {
        label: 'I am interested in Momentum',
        description:
          'Momentum is a 30-minute daily stream you can join live or watch as a recording.'
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
      chooseAuth: 'Sláðu inn netfangið til að fá töfrahlekk',
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
      successMomentum:
        'Momentum er vikulegur einn klukkutími í streymi fyrir fólk sem vill styrkja sig í kerfisþróun og forritun.',
      questions: {
        name: 'Fullt nafn',
        age: 'Aldur',
        education: 'Hæsta menntunarstig',
        employment: 'Atvinna núna',
        location: 'Staðsetning'
      },
      learning: {
        motivation: 'Hvað hvetur þig til að læra núna?',
        motivationHelp: 'Veldu það sem á best við þig.',
        motivationOptions: [
          'Mig vantar skýra námsleið',
          'Ég þarf ábyrgð og skriðþunga',
          'Ég vil breyta um starf eða bæta mig',
          'Ég er að kanna nýjar hugmyndir og verkfæri'
        ],
        experience: 'Lýstu fyrri reynslu af netnámi',
        experienceHelp: 'Veldu setninguna sem lýsir þér best.',
        experienceOptions: [
          'Ég er ný í netnámi',
          'Ég hef prófað nokkur námskeið',
          'Ég læri reglulega á netinu',
          'Ég leiðbeini eða kenni öðrum á netinu'
        ],
        time: 'Hversu margar klst. á viku getur þú varið?',
        timeHelp: 'Þetta hjálpar okkur að stilla raunhæfan hraða.',
        timeOptions: ['1-3 klst', '3-5 klst', '5-8 klst', '8+ klst'],
        preferences: 'Uppáhalds námsstíll'
        ,
        preferencesHelp: 'Veldu stílinn sem heldur þér virkum.',
        preferencesOptions: [
          'Verkefnamiðað',
          'Stuttar kennslulotur með æfingum',
          'Ítarlegar yfirferðir og lestur',
          'Hópvinna og endurgjöf'
        ],
        detailPrompt: 'Bættu við nánari upplýsingum (valfrjálst)'
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
      },
      momentum: {
        label: 'Ég hef áhuga á Momentum',
        description:
          'Momentum er 30 minútna daglegt streymi sem þú getur fylgst með í beinni eða horft á upptöku.'
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
  ,
  no: {
    home: {
      title: 'Finn din læringsvei med Vegvisr',
      subtitle: 'Svar på noen spørsmål så vi kan tilpasse onboardingen din.',
      chooseAuth: 'Skriv inn e-posten din for å få en magisk lenke',
      google: 'Fortsett med Google',
      email: 'Fortsett med e-post',
      emailPlaceholder: 'Skriv inn e-postadressen din',
      sendLink: 'Send magisk lenke',
      linkSent: 'Magisk lenke sendt. Sjekk innboksen.',
      language: 'Språk'
    },
    auth: {
      verifying: 'Verifiserer tilgangen din...',
      success: 'Du er verifisert. Sender deg til onboarding.',
      failure: 'Vi kunne ikke verifisere lenken. Be om en ny.',
      callbackError: 'Vi kunne ikke fullføre Google-innloggingen. Prøv igjen.'
    },
    onboarding: {
      title: 'Din Vegvisr onboarding',
      step: 'Steg',
      of: 'av',
      next: 'Neste steg',
      back: 'Tilbake',
      submit: 'Send onboarding',
      saving: 'Lagrer fremdrift...',
      saved: 'Alt er lagret',
      successTitle: 'Du er klar!',
      successBody:
        'Vi har mottatt svarene dine. Vi vil gå gjennom dem og komme tilbake til deg så snart vi kan. Tidsrammen kan variere avhengig av antall innsendelser.',
      successMomentum:
        'Momentum er en ukentlig times sending for deg som vil utvikle deg innen systemutvikling og koding.',
      questions: {
        name: 'Fullt navn',
        age: 'Alder',
        education: 'Høyeste utdanningsnivå',
        employment: 'Nåværende arbeidssituasjon',
        location: 'Sted'
      },
      learning: {
        motivation: 'Hva motiverer deg til å lære nå?',
        motivationHelp: 'Velg det som passer best.',
        motivationOptions: [
          'Jeg vil ha en strukturert læringsvei',
          'Jeg trenger ansvar og fremdrift',
          'Jeg vil bytte karriere eller utvikle meg',
          'Jeg utforsker nye ideer og verktøy'
        ],
        experience: 'Beskriv tidligere erfaring med nettlæring',
        experienceHelp: 'Velg utsagnet som passer best.',
        experienceOptions: [
          'Jeg er ny til nettlæring',
          'Jeg har prøvd noen kurs',
          'Jeg lærer jevnlig på nett',
          'Jeg veileder eller underviser andre på nett'
        ],
        time: 'Hvor mange timer per uke kan du bruke?',
        timeHelp: 'Dette hjelper oss å sette et realistisk tempo.',
        timeOptions: ['1-3 timer', '3-5 timer', '5-8 timer', '8+ timer'],
        preferences: 'Foretrukket læringsstil',
        preferencesHelp: 'Velg stilen som holder deg engasjert.',
        preferencesOptions: [
          'Praktiske prosjekter',
          'Korte leksjoner med øving',
          'Dype dykk med lesing',
          'Gruppebasert læring og tilbakemelding'
        ],
        detailPrompt: 'Legg til detaljer (valgfritt)'
      },
      interests: {
        title: 'Velg interesser',
        description: 'Velg temaene som frister deg mest.',
        topics: [
          'Dataleseferdighet',
          'Grunnleggende AI',
          'Produktdesign',
          'Tjenestedesign',
          'Bærekraft',
          'Ledelse',
          'Prosjektledelse',
          'Forretningsstrategi',
          'Kreativ koding',
          'Historiefortelling',
          'Markedsvekst',
          'UX-forskning',
          'Entreprenørskap',
          'Fintech',
          'Velvære'
        ]
      },
      momentum: {
        label: 'Jeg er interessert i Momentum',
        description:
          'Momentum er en daglig stream på 30 minutter som du kan følge live eller se som opptak.'
      }
    },
    common: {
      loading: 'Laster...',
      emailLabel: 'E-postadresse',
      required: 'Dette feltet er påkrevd',
      tryAgain: 'Prøv igjen',
      signOut: 'Bruk en annen e-post',
      autosaveHint: 'Fremdriften lagres automatisk.'
    }
  },
  nl: {
    home: {
      title: 'Vind je leerpad met Vegvisr',
      subtitle: 'Beantwoord een paar vragen zodat we je onboarding kunnen afstemmen.',
      chooseAuth: 'Vul je e-mailadres in om een magische link te krijgen',
      google: 'Doorgaan met Google',
      email: 'Doorgaan met e-mail',
      emailPlaceholder: 'Vul je e-mailadres in',
      sendLink: 'Stuur magische link',
      linkSent: 'Magische link verzonden. Controleer je inbox.',
      language: 'Taal'
    },
    auth: {
      verifying: 'Je toegang wordt geverifieerd...',
      success: 'Je bent geverifieerd. We sturen je naar de onboarding.',
      failure: 'We konden die link niet verifiëren. Vraag een nieuwe aan.',
      callbackError: 'We konden Google-aanmelding niet voltooien. Probeer opnieuw.'
    },
    onboarding: {
      title: 'Jouw Vegvisr onboarding',
      step: 'Stap',
      of: 'van',
      next: 'Volgende stap',
      back: 'Terug',
      submit: 'Onboarding verzenden',
      saving: 'Voortgang opslaan...',
      saved: 'Alles opgeslagen',
      successTitle: 'Je bent er klaar voor!',
      successBody:
        'We hebben je antwoorden ontvangen. We bekijken ze en nemen zo snel mogelijk contact met je op. De doorlooptijd kan variëren op basis van het aantal inzendingen.',
      successMomentum:
        'Momentum is een wekelijkse stream van een uur voor mensen die zich willen ontwikkelen in systeemontwikkeling en coderen.',
      questions: {
        name: 'Volledige naam',
        age: 'Leeftijd',
        education: 'Hoogst behaalde opleiding',
        employment: 'Huidige werksituatie',
        location: 'Locatie'
      },
      learning: {
        motivation: 'Wat motiveert je om nu te leren?',
        motivationHelp: 'Kies wat het beste bij je past.',
        motivationOptions: [
          'Ik wil een gestructureerd leerpad',
          'Ik heb verantwoordelijkheid en momentum nodig',
          'Ik wil van carrière veranderen of mezelf ontwikkelen',
          'Ik verken nieuwe ideeën en tools'
        ],
        experience: 'Beschrijf je eerdere ervaring met online leren',
        experienceHelp: 'Kies de uitspraak die het beste past.',
        experienceOptions: [
          'Ik ben nieuw met online leren',
          'Ik heb een paar cursussen geprobeerd',
          'Ik leer regelmatig online',
          'Ik begeleid of geef anderen online les'
        ],
        time: 'Hoeveel uur per week kun je besteden?',
        timeHelp: 'Dit helpt ons een realistisch tempo te bepalen.',
        timeOptions: ['1-3 uur', '3-5 uur', '5-8 uur', '8+ uur'],
        preferences: 'Voorkeur voor leerstijl',
        preferencesHelp: 'Kies de stijl die je betrokken houdt.',
        preferencesOptions: [
          'Praktische projecten',
          'Korte lessen met oefening',
          'Diepe duiken met lezen',
          'Groepsleren en feedback'
        ],
        detailPrompt: 'Voeg details toe (optioneel)'
      },
      interests: {
        title: 'Selecteer je interesses',
        description: 'Kies de onderwerpen die je het meest aanspreken.',
        topics: [
          'Dataliteracy',
          'AI-basis',
          'Productdesign',
          'Servicedesign',
          'Duurzaamheid',
          'Leiderschap',
          'Projectmanagement',
          'Bedrijfsstrategie',
          'Creatief coderen',
          'Storytelling',
          'Marketinggroei',
          'UX-onderzoek',
          'Ondernemerschap',
          'Fintech',
          'Welzijn'
        ]
      },
      momentum: {
        label: 'Ik ben geïnteresseerd in Momentum',
        description:
          'Momentum is een dagelijkse stream van 30 minuten die je live kunt volgen of als opname kunt bekijken.'
      }
    },
    common: {
      loading: 'Laden...',
      emailLabel: 'E-mailadres',
      required: 'Dit veld is verplicht',
      tryAgain: 'Probeer opnieuw',
      signOut: 'Gebruik een ander e-mailadres',
      autosaveHint: 'Voortgang wordt automatisch opgeslagen.'
    }
  }
};

export const getInterestTopics = (language: Language) => {
  // First check branding translations for custom topics
  if (brandingTranslations?.[language]) {
    const brandingOnboarding = brandingTranslations[language]?.onboarding as Record<string, unknown> | undefined;
    const brandingInterests = brandingOnboarding?.interests as Record<string, unknown> | undefined;
    const brandingTopics = brandingInterests?.topics;
    if (Array.isArray(brandingTopics)) {
      return brandingTopics as string[];
    }
  }

  // Fall back to bundled translations
  const interests = translations[language].onboarding as TranslationTree;
  const topicValue = (interests?.interests as TranslationTree)?.topics;
  return Array.isArray(topicValue) ? topicValue : [];
};

export const getLearningOptions = (
  language: Language,
  key: 'motivationOptions' | 'experienceOptions' | 'timeOptions' | 'preferencesOptions'
) => {
  // First check branding translations for custom options
  if (brandingTranslations?.[language]) {
    const brandingOnboarding = brandingTranslations[language]?.onboarding as Record<string, unknown> | undefined;
    const brandingLearning = brandingOnboarding?.learning as Record<string, unknown> | undefined;
    const brandingValue = brandingLearning?.[key];
    if (Array.isArray(brandingValue)) {
      return brandingValue as string[];
    }
  }

  // Fall back to bundled translations
  const onboarding = translations[language].onboarding as TranslationTree;
  const learning = onboarding?.learning as TranslationTree;
  const value = learning?.[key];
  return Array.isArray(value) ? value : [];
};

// Store for branding translation overrides
let brandingTranslations: Record<string, Record<string, unknown>> | null = null;

export const setBrandingTranslations = (translations: Record<string, Record<string, unknown>> | null) => {
  brandingTranslations = translations;
};

export const getTranslation = (language: Language, key: string): string => {
  const parts = key.split('.');

  // First check branding translations override
  if (brandingTranslations?.[language]) {
    let brandingNode: unknown = brandingTranslations[language];
    let found = true;
    for (const part of parts) {
      if (brandingNode && typeof brandingNode === 'object' && !Array.isArray(brandingNode)) {
        brandingNode = (brandingNode as Record<string, unknown>)[part];
      } else {
        found = false;
        break;
      }
    }
    if (found && typeof brandingNode === 'string') {
      return brandingNode;
    }
  }

  // Fall back to bundled translations
  let node: TranslationValue | undefined = translations[language];
  for (const part of parts) {
    if (!node || typeof node === 'string' || Array.isArray(node)) {
      return key;
    }
    node = node[part];
  }
  return typeof node === 'string' ? node : key;
};
