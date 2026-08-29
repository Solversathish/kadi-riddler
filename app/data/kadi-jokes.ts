export type KadiJoke = {
  id: number;
  category: string;
  question: string;
  answer: string;
  tanglishQuestion?: string;
  tanglishAnswer?: string;
};

export const kadiJokes: KadiJoke[] = [
  {
    id: 1,
    category: "Tamil Kadi",
    question: "ஒரு பூனை ஏன் computer-ஐ பயன்படுத்தாது? 🐱💻",
    answer: "அதுக்கு mouse பிடிக்காது! 🐭😂",
    tanglishQuestion:
      "Oru poonai yen computer-ai payanpaduthaadhu? 🐱💻",
    tanglishAnswer:
      "Adhukku mouse pidikkaadhu! 🐭😂",
  },

  {
    id: 2,
    category: "Tamil Kadi",
    question: "முட்டை ஏன் பள்ளிக்கூடம் போகாது? 🥚",
    answer: "அது already broken record! 😂",
    tanglishQuestion:
      "Muttai yen pallikkoodam pogaadhu? 🥚",
    tanglishAnswer:
      "Adhu already broken record! 😂",
  },

  {
    id: 3,
    category: "Funny Questions",
    question: "What kind of room has no doors or windows?",
    answer: "A mushroom! 🍄😂",
  },

  {
    id: 4,
    category: "Dad Jokes",
    question: "Why don't eggs tell jokes?",
    answer: "Because they might crack each other up! 🥚😂",
  },

  {
    id: 5,
    category: "Funny Questions",
    question: "Why did the math book look sad?",
    answer: "Because it had too many problems! 📚😂",
  },

  {
    id: 6,
    category: "Dad Jokes",
    question: "Why did the bicycle fall over?",
    answer: "Because it was two-tired! 🚲😂",
  },
];

export const kadiJokeCategories = [
  "All",
  "Tamil Kadi",
  "Funny Questions",
  "Dad Jokes",
];