import { DailyChallenge, PastorProfile, BibleChapter, BibleVerse } from "../types";

// Mock Data Service - No AI dependencies

const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    verse: "For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.",
    reference: "Jeremiah 29:11",
    reflectionQuestion: "How does trusting in God's future plan change how you view your current struggles?",
    actionItem: "Write down three things you are hopeful for and thank God for them.",
    prayerFocus: "Trust in times of uncertainty."
  },
  {
    verse: "But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.",
    reference: "Galatians 5:22-23",
    reflectionQuestion: "Which fruit of the Spirit do you find most difficult to practice today?",
    actionItem: "Choose one fruit to focus on and practice it intentionally with everyone you meet today.",
    prayerFocus: "Growth in spiritual character."
  },
  {
    verse: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9",
    reflectionQuestion: "Where in your life do you need to step out in faith despite fear?",
    actionItem: "Identify one fear holding you back and pray a specific prayer of surrender regarding it.",
    prayerFocus: "Courage to follow God's lead."
  }
];

export const generateDailyChallenge = async (): Promise<DailyChallenge> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  const index = Math.floor(Math.random() * DAILY_CHALLENGES.length);
  return DAILY_CHALLENGES[index];
};

const BIBLE_CONTENT: Record<string, BibleChapter> = {
  "Genesis-1": {
    book: "Genesis",
    chapter: 1,
    summary: "God creates the heavens and the earth in six days and rests on the seventh.",
    verses: [
      { number: 1, text: "In the beginning God created the heavens and the earth." },
      { number: 2, text: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters." },
      { number: 3, text: "And God said, “Let there be light,” and there was light." },
      { number: 4, text: "God saw that the light was good, and he separated the light from the darkness." },
      { number: 5, text: "God called the light “day,” and the darkness he called “night.” And there was evening, and there was morning—the first day." }
    ]
  },
  "Psalm-23": {
    book: "Psalms",
    chapter: 23,
    summary: "A psalm of David portraying the Lord as a shepherd who provides, guides, and protects.",
    verses: [
      { number: 1, text: "The Lord is my shepherd, I lack nothing." },
      { number: 2, text: "He makes me lie down in green pastures, he leads me beside quiet waters," },
      { number: 3, text: "he refreshes my soul. He guides me along the right paths for his name’s sake." },
      { number: 4, text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me." }
    ]
  },
  "John-3": {
    book: "John",
    chapter: 3,
    summary: "Jesus teaches Nicodemus about being born again and God's love for the world.",
    verses: [
      { number: 16, text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." },
      { number: 17, text: "For God did not send his Son into the world to condemn the world, but to save the world through him." }
    ]
  }
};

export const getBibleChapter = async (book: string, chapter: number): Promise<BibleChapter> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const key = `${book}-${chapter}`;
  
  if (BIBLE_CONTENT[key]) {
    return BIBLE_CONTENT[key];
  }

  // Fallback for demo purposes
  return {
    book: book,
    chapter: chapter,
    summary: "Content not available in offline mode. Please select Genesis 1, Psalm 23, or John 3 for demonstration.",
    verses: [
      { number: 1, text: "Scripture content is currently limited in this demo version." },
      { number: 2, text: "Please navigate to Genesis 1 to see the full reader experience." }
    ]
  };
};

// No longer needed but keeping export to avoid breaking imports if any
export const createPastorChat = () => { return null; };
