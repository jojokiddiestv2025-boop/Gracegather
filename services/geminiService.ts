import { GoogleGenAI, Type } from "@google/genai";
import { DailyChallenge, BibleChapter, BibleVerse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDailyChallenge = async (): Promise<DailyChallenge> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Generate a daily Christian devotional challenge. It must include a bible verse (NIV), a reference, a reflection question, an action item, and a prayer focus.',
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verse: { type: Type.STRING },
          reference: { type: Type.STRING },
          reflectionQuestion: { type: Type.STRING },
          actionItem: { type: Type.STRING },
          prayerFocus: { type: Type.STRING },
        },
        required: ['verse', 'reference', 'reflectionQuestion', 'actionItem', 'prayerFocus'],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to generate daily challenge");
  }
  return JSON.parse(text) as DailyChallenge;
};

export const getBibleChapter = async (book: string, chapter: number, translation: string = 'NIV'): Promise<BibleChapter> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide the full text and a summary for ${book} chapter ${chapter}. Use the ${translation} translation. Ensure the text is accurate to the requested version.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          book: { type: Type.STRING },
          chapter: { type: Type.INTEGER },
          summary: { type: Type.STRING },
          verses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                number: { type: Type.INTEGER },
                text: { type: Type.STRING },
              },
              required: ['number', 'text'],
            },
          },
        },
        required: ['book', 'chapter', 'summary', 'verses'],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to fetch bible chapter");
  }
  return JSON.parse(text) as BibleChapter;
};

// No longer needed but keeping export to avoid breaking imports if any
export const createPastorChat = () => { return null; };
