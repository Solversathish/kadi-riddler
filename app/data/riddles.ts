export type Riddle = {
  id: number;
  category: string;
  difficulty: string;
  question: string;
  answer: string;
  tanglishQuestion?: string;
  tanglishAnswer?: string;
};

export const riddles: Riddle[] = [
  {
    id: 1,
    category: "English",
    difficulty: "Easy",
    question: "I have hands but cannot clap. What am I?",
    answer: "A clock",
  },

  {
    id: 2,
    category: "English",
    difficulty: "Easy",
    question: "What has many keys but cannot open a single door?",
    answer: "A piano",
  },

  {
    id: 3,
    category: "Funny",
    difficulty: "Easy",
    question: "What gets wetter the more it dries?",
    answer: "A towel",
  },

  {
    id: 4,
    category: "Logic",
    difficulty: "Medium",
    question:
      "A farmer has 17 sheep. All but 9 run away. How many sheep are left?",
    answer: "9 sheep",
  },

  {
    id: 5,
    category: "Tricky",
    difficulty: "Medium",
    question: "How many months have 28 days?",
    answer: "All 12 months",
  },

  {
    id: 6,
    category: "Tamil",
    difficulty: "Easy",
    question: "கால்கள் உண்டு, ஆனால் நடக்க முடியாது. அது என்ன?",
    answer: "மேசை",
    tanglishQuestion:
      "Kaalkal undu, aanaal nadakka mudiyaadhu. Adhu enna?",
    tanglishAnswer: "Mesai",
  },
];

export const riddleCategories = [
  "All",
  "English",
  "Tamil",
  "Funny",
  "Logic",
  "Tricky",
];