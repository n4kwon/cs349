export type Question = {
  question: string;
  answer: string;
  other1: string;
  other2: string;
  isSelected: boolean;
  id: number;
};

const rawQuestions = [
  {
    question: "What is the capital of Canada?",
    answer: "Ottawa",
    other1: "Toronto",
    other2: "Vancouver",
  },
  {
    question: "Which planet is closest to the Sun?",
    answer: "Mercury",
    other1: "Venus",
    other2: "Earth",
  },
  {
    question: "Who wrote the play Romeo and Juliet?",
    answer: "William Shakespeare",
    other1: "Charles Dickens",
    other2: "Jane Austen",
  },
  {
    question: "What is the chemical symbol for water?",
    answer: "H2O",
    other1: "CO2",
    other2: "O2",
  },
  {
    question: "Which element has the atomic number 1?",
    answer: "Hydrogen",
    other1: "Helium",
    other2: "Oxygen",
  },
  {
    question: "What is the tallest mountain in the world?",
    answer: "Mount Everest",
    other1: "K2",
    other2: "Kangchenjunga",
  },
  {
    question: "What is the smallest planet in the solar system?",
    answer: "Mercury",
    other1: "Mars",
    other2: "Venus",
  },
  {
    question: "Who painted the Mona Lisa?",
    answer: "Leonardo da Vinci",
    other1: "Vincent van Gogh",
    other2: "Pablo Picasso",
  },
  {
    question: "What is the chemical symbol for gold?",
    answer: "Au",
    other1: "Ag",
    other2: "Pb",
  },
  {
    question: "Who discovered penicillin?",
    answer: "Alexander Fleming",
    other1: "Marie Curie",
    other2: "Isaac Newton",
  },
  {
    question: "What is the largest ocean on Earth?",
    answer: "Pacific Ocean",
    other1: "Atlantic Ocean",
    other2: "Indian Ocean",
  },
  {
    question: "Which country is home to the kangaroo?",
    answer: "Australia",
    other1: "South Africa",
    other2: "India",
  },
  {
    question: "Who wrote '1984'?",
    answer: "George Orwell",
    other1: "Aldous Huxley",
    other2: "Ray Bradbury",
  },
  {
    question: "What is the hardest natural substance?",
    answer: "Diamond",
    other1: "Gold",
    other2: "Iron",
  },
  {
    question: "What is the largest desert in the world?",
    answer: "Sahara Desert",
    other1: "Gobi Desert",
    other2: "Arctic Desert",
  },
  {
    question: "Who is the author of Harry Potter?",
    answer: "J.K. Rowling",
    other1: "J.R.R. Tolkien",
    other2: "George R.R. Martin",
  },
  {
    question: "What is the most spoken language?",
    answer: "Mandarin",
    other1: "Spanish",
    other2: "English",
  },
  {
    question: "Who invented the telephone?",
    answer: "Alexander Graham Bell",
    other1: "Thomas Edison",
    other2: "Nikola Tesla",
  },
  {
    question: "Which planet is known as the Red Planet?",
    answer: "Mars",
    other1: "Jupiter",
    other2: "Saturn",
  },
  {
    question: "What is the capital city of Japan?",
    answer: "Tokyo",
    other1: "Kyoto",
    other2: "Osaka",
  },
  {
    question: "Which organ pumps blood through the body?",
    answer: "Heart",
    other1: "Liver",
    other2: "Lungs",
  },
  {
    question: "Which planet has the most moons?",
    answer: "Jupiter",
    other1: "Saturn",
    other2: "Neptune",
  },
  {
    question: "What is the largest continent on Earth?",
    answer: "Asia",
    other1: "Africa",
    other2: "North America",
  },
  {
    question: "Who developed the theory of relativity?",
    answer: "Albert Einstein",
    other1: "Isaac Newton",
    other2: "Galileo Galilei",
  },
  {
    question: "Which element is for photosynthesis?",
    answer: "Carbon dioxide",
    other1: "Oxygen",
    other2: "Nitrogen",
  },
  {
    question: "Which famous ship sank in 1912?",
    answer: "Titanic",
    other1: "Lusitania",
    other2: "Bismarck",
  },
  {
    question: "What's the main ingredient in guacamole?",
    answer: "Avocado",
    other1: "Tomato",
    other2: "Onion",
  },
  {
    question: "Which gas do humans need to breathe?",
    answer: "Oxygen",
    other1: "Carbon dioxide",
    other2: "Helium",
  },
  {
    question: "Which planet is known for its rings?",
    answer: "Saturn",
    other1: "Uranus",
    other2: "Neptune",
  },
  {
    question: "Where is the Sahara Desert?",
    answer: "Africa",
    other1: "Asia",
    other2: "Australia",
  },
  {
    question: "Which is the largest mammal?",
    answer: "Blue whale",
    other1: "Elephant",
    other2: "Giraffe",
  },
  {
    question: "What is the hardest rock?",
    answer: "Diamond",
    other1: "Granite",
    other2: "Marble",
  },
  {
    question: "Which country is Paris the capital of?",
    answer: "France",
    other1: "Spain",
    other2: "Germany",
  },
  {
    question: "Which metal is liquid at room temperature?",
    answer: "Mercury",
    other1: "Lead",
    other2: "Copper",
  },
  {
    question: "Which planet is known as the Morning Star?",
    answer: "Venus",
    other1: "Mars",
    other2: "Jupiter",
  },
  {
    question: "What is the square root of 64?",
    answer: "8",
    other1: "6",
    other2: "4",
  },
  {
    question: "What is the largest island in the world?",
    answer: "Greenland",
    other1: "Australia",
    other2: "Madagascar",
  },
  {
    question: "What is the fastest land animal?",
    answer: "Cheetah",
    other1: "Lion",
    other2: "Horse",
  },
  {
    question: "Which city is known as the Big Apple?",
    answer: "New York City",
    other1: "Los Angeles",
    other2: "Chicago",
  },
  {
    question: "Who wrote the play Hamlet?",
    answer: "William Shakespeare",
    other1: "Charles Dickens",
    other2: "Oscar Wilde",
  },
  {
    question: "What is the chemical formula for table salt?",
    answer: "NaCl",
    other1: "H2O",
    other2: "CO2",
  },
  {
    question: "Which country has the largest population?",
    answer: "China",
    other1: "India",
    other2: "United States",
  },
  {
    question: "What is the national flower of Japan?",
    answer: "Cherry blossom",
    other1: "Rose",
    other2: "Lotus",
  },
  {
    question: "Which blood type is a universal donor?",
    answer: "O negative",
    other1: "A positive",
    other2: "AB positive",
  },
  {
    question: "What's the most abundant gas in our atmosphere?",
    answer: "Nitrogen",
    other1: "Oxygen",
    other2: "Carbon dioxide",
  },
  {
    question: "What is the currency of Japan?",
    answer: "Yen",
    other1: "Won",
    other2: "Baht",
  },
  {
    question: "Who was the first man to step on the Moon?",
    answer: "Neil Armstrong",
    other1: "Buzz Aldrin",
    other2: "Michael Collins",
  },
  {
    question: "What is the chemical symbol for iron?",
    answer: "Fe",
    other1: "Ir",
    other2: "I",
  },
  {
    question: "Which is the smallest bone in the human body?",
    answer: "Stapes",
    other1: "Femur",
    other2: "Fibula",
  },
  {
    question: "What is the capital city of Canada?",
    answer: "Ottawa",
    other1: "Toronto",
    other2: "Montreal",
  },
  {
    question: "Which organ in our body is for detoxification?",
    answer: "Liver",
    other1: "Kidneys",
    other2: "Pancreas",
  },
];

export const questions = rawQuestions.map((q, index) => ({
  ...q,
  id: index + 1,
}));
