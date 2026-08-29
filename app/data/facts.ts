export type Fact = {
  id: number;
  category: string;
  emoji: string;
  fact: string;
  detail: string;
};

export const facts: Fact[] = [
  {
    id: 1,
    category: "Animals",
    emoji: "🐙",
    fact: "Octopuses have three hearts.",
    detail:
      "Two hearts pump blood to the gills, while the third pumps blood to the rest of the body.",
  },

  {
    id: 2,
    category: "Space",
    emoji: "🌌",
    fact: "A day on Venus is longer than a year on Venus.",
    detail:
      "Venus rotates so slowly that one rotation takes longer than the time it takes Venus to orbit the Sun.",
  },

  {
    id: 3,
    category: "Human Body",
    emoji: "🧠",
    fact: "The human brain uses a surprisingly large amount of energy.",
    detail:
      "Even though the brain is only a small part of body mass, it requires a significant share of the body's energy.",
  },

  {
    id: 4,
    category: "Animals",
    emoji: "🦈",
    fact: "Sharks are older than trees.",
    detail:
      "Shark ancestors appeared hundreds of millions of years ago, before the first trees evolved.",
  },

  {
    id: 5,
    category: "Science",
    emoji: "⚡",
    fact:
      "Lightning can heat the air to temperatures hotter than the surface of the Sun.",
    detail:
      "The intense electrical discharge rapidly heats the surrounding air, producing the explosive sound we know as thunder.",
  },

  {
    id: 6,
    category: "Ocean",
    emoji: "🌊",
    fact: "Most of Earth's volcanic activity happens underwater.",
    detail:
      "A huge amount of volcanic activity occurs along underwater mountain ranges and other areas of the ocean floor.",
  },

  {
    id: 7,
    category: "Technology",
    emoji: "💻",
    fact: "The first computer mouse was made from wood.",
    detail:
      "An early computer mouse prototype was built with a wooden casing and wheels for tracking movement.",
  },

  {
    id: 8,
    category: "History",
    emoji: "🏛️",
    fact:
      "The Great Pyramid of Giza was the tallest human-made structure for thousands of years.",
    detail:
      "Its original height was roughly 146 meters, and it remained taller than any other known human-made structure for a very long period.",
  },

  {
    id: 9,
    category: "Weird & Crazy",
    emoji: "🤯",
    fact:
      "Bananas are botanically berries, but strawberries are not.",
    detail:
      "Botanical definitions of berries are based on how fruits develop, which produces some surprising classifications.",
  },

  {
    id: 10,
    category: "Science",
    emoji: "🧪",
    fact: "Water can exist naturally in three states on Earth.",
    detail:
      "Water can be found as a solid, liquid, and gas in the natural environment, such as ice, liquid water, and water vapor.",
  },
];

export const factCategories = [
  "All",
  "Animals",
  "Space",
  "Science",
  "Human Body",
  "History",
  "Technology",
  "Ocean",
  "Weird & Crazy",
];