import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: "Beignet au Chocolat",
    description: "Délicieux beignet fourré au chocolat noir",
    detailedDescription: "Nos beignets au chocolat sont préparés avec une pâte légère et aérée, fourrée d'un délicieux chocolat noir de qualité supérieure. Chaque bouchée est un moment de pur plaisir, avec un équilibre parfait entre la douceur de la pâte et l'intensité du chocolat.",
    price: 3500,
    images: [
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
      "https://images.unsplash.com/photo-1533134242443-919f1b9c7b9e?w=500"
    ],
    category: "Beignets",
    ingredients: ["Farine", "Chocolat noir", "Sucre", "Levure", "Œufs", "Beurre"],
    preparationTime: "15 minutes",
    allergens: ["Gluten", "Lait", "Œufs"],
    nutritionalInfo: {
      calories: 280,
      proteins: 4,
      carbohydrates: 35,
      fats: 12
    }
  },
  {
    id: 2,
    name: "Fataya au Poulet",
    description: "Fataya traditionnelle farcie au poulet épicé",
    detailedDescription: "Nos fatayas au poulet sont préparées selon une recette traditionnelle, avec une pâte fine et croustillante. Le poulet est mariné dans un mélange d'épices savoureux, créant une explosion de saveurs à chaque bouchée.",
    price: 2500,
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500",
      "https://images.unsplash.com/photo-1533134242443-919f1b9c7b9e?w=500"
    ],
    category: "Fatayas",
    ingredients: ["Farine", "Poulet", "Oignons", "Épices", "Huile d'olive"],
    preparationTime: "20 minutes",
    allergens: ["Gluten"],
    nutritionalInfo: {
      calories: 320,
      proteins: 15,
      carbohydrates: 30,
      fats: 15
    }
  },
  {
    id: 3,
    name: "Quiche Lorraine",
    description: "Quiche classique au lard et au fromage",
    detailedDescription: "Notre quiche lorraine est préparée avec une pâte brisée maison, des lardons de qualité, des œufs frais et une crème onctueuse. Le fromage râpé ajoute une touche de fondant à cette recette traditionnelle.",
    price: 5000,
    images: [
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500",
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500"
    ],
    category: "Quiches",
    ingredients: ["Farine", "Beurre", "Lardons", "Œufs", "Crème fraîche", "Fromage"],
    preparationTime: "25 minutes",
    allergens: ["Gluten", "Lait", "Œufs"],
    nutritionalInfo: {
      calories: 350,
      proteins: 12,
      carbohydrates: 25,
      fats: 20
    }
  },
  {
    id: 4,
    name: "Quiche Lorraine",
    description: "Quiche classique au lard et au fromage",
    detailedDescription: "Notre quiche lorraine est préparée avec une pâte brisée maison, des lardons de qualité, des œufs frais et une crème onctueuse. Le fromage râpé ajoute une touche de fondant à cette recette traditionnelle.",
    price: 5000,
    images: [
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500",
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500"
    ],
    category: "Quiches",
    ingredients: ["Farine", "Beurre", "Lardons", "Œufs", "Crème fraîche", "Fromage"],
    preparationTime: "25 minutes",
    allergens: ["Gluten", "Lait", "Œufs"],
    nutritionalInfo: {
      calories: 350,
      proteins: 12,
      carbohydrates: 25,
      fats: 20
    }
  },
  {
    id: 5,
    name: "Quiche Lorraine",
    description: "Quiche classique au lard et au fromage",
    detailedDescription: "Notre quiche lorraine est préparée avec une pâte brisée maison, des lardons de qualité, des œufs frais et une crème onctueuse. Le fromage râpé ajoute une touche de fondant à cette recette traditionnelle.",
    price: 5000,
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500"
    ],
    category: "Quiches",
    ingredients: ["Farine", "Beurre", "Lardons", "Œufs", "Crème fraîche", "Fromage"],
    preparationTime: "25 minutes",
    allergens: ["Gluten", "Lait", "Œufs"],
    nutritionalInfo: {
      calories: 350,
      proteins: 12,
      carbohydrates: 25,
      fats: 20
    }
  },

  {
    id: 6,
    name: "Quiche Lorraine",
    description: "Quiche classique au lard et au fromage",
    detailedDescription: "Notre quiche lorraine est préparée avec une pâte brisée maison, des lardons de qualité, des œufs frais et une crème onctueuse. Le fromage râpé ajoute une touche de fondant à cette recette traditionnelle.",
    price: 5000,
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500"
    ],
    category: "Quiches",
    ingredients: ["Farine", "Beurre", "Lardons", "Œufs", "Crème fraîche", "Fromage"],
    preparationTime: "25 minutes",
    allergens: ["Gluten", "Lait", "Œufs"],
    nutritionalInfo: {
      calories: 350,
      proteins: 12,
      carbohydrates: 25,
      fats: 20
    }
  }, 
  {
    id: 7,
    name: "Quiche Lorraine",
    description: "Quiche classique au lard et au fromage",
    detailedDescription: "Notre quiche lorraine est préparée avec une pâte brisée maison, des lardons de qualité, des œufs frais et une crème onctueuse. Le fromage râpé ajoute une touche de fondant à cette recette traditionnelle.",
    price: 5000,
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500"
    ],
    category: "Quiches",
    ingredients: ["Farine", "Beurre", "Lardons", "Œufs", "Crème fraîche", "Fromage"],
    preparationTime: "25 minutes",
    allergens: ["Gluten", "Lait", "Œufs"],
    nutritionalInfo: {
      calories: 350,
      proteins: 12,
      carbohydrates: 25,
      fats: 20
    }
  }, 
  {
    id: 8,
    name: "Quiche Lorraine",
    description: "Quiche classique au lard et au fromage",
    detailedDescription: "Notre quiche lorraine est préparée avec une pâte brisée maison, des lardons de qualité, des œufs frais et une crème onctueuse. Le fromage râpé ajoute une touche de fondant à cette recette traditionnelle.",
    price: 5000,
    images: [
     "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500"
    ],
    category: "Quiches",
    ingredients: ["Farine", "Beurre", "Lardons", "Œufs", "Crème fraîche", "Fromage"],
    preparationTime: "25 minutes",
    allergens: ["Gluten", "Lait", "Œufs"],
    nutritionalInfo: {
      calories: 350,
      proteins: 12,
      carbohydrates: 25,
      fats: 20
    }
  }
]; 