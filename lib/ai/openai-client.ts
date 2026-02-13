import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  // eslint-disable-next-line no-console
  console.warn("[openai] OPENAI_API_KEY is not set. OpenAI client will not work.");
}

export const openai = new OpenAI({
  apiKey,
  // Edge runtime を考慮して明示的に設定
  dangerouslyAllowBrowser: false
});

