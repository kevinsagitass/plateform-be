import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { menuCategories, menus } from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const db = drizzle(connection);

async function seed() {
  console.log("🌱 Seeding...");

  // ==================
  // Seed Menu Categories
  // ==================
  const categoriesData = [
    { id: crypto.randomUUID(), categoryName: "Makanan Utama" },
    { id: crypto.randomUUID(), categoryName: "Minuman" },
    { id: crypto.randomUUID(), categoryName: "Snack & Cemilan" },
    { id: crypto.randomUUID(), categoryName: "Dessert" },
  ];

  await db.insert(menuCategories).values(categoriesData);
  console.log("✅ Menu Categories seeded!");

  // ==================
  // Seed Menus
  // ==================
  const menusData = [
    // Makanan Utama
    {
      categoryId: categoriesData[0].id,
      name: "Nasi Goreng Spesial",
      description: "Nasi goreng dengan telur, ayam, dan sayuran segar",
      imagePath: "/images/nasi-goreng.jpg",
      price: 35000,
      discount: 0,
    },
    {
      categoryId: categoriesData[0].id,
      name: "Ayam Bakar",
      description: "Ayam bakar dengan bumbu kecap dan rempah pilihan",
      imagePath: "/images/ayam-bakar.jpg",
      price: 45000,
      discount: 5000,
    },
    {
      categoryId: categoriesData[0].id,
      name: "Mie Goreng",
      description: "Mie goreng dengan topping lengkap",
      imagePath: "/images/mie-goreng.jpg",
      price: 30000,
      discount: 0,
    },

    // Minuman
    {
      categoryId: categoriesData[1].id,
      name: "Es Teh Manis",
      description: "Teh manis segar dengan es batu",
      imagePath: "/images/es-teh.jpg",
      price: 8000,
      discount: 0,
    },
    {
      categoryId: categoriesData[1].id,
      name: "Jus Alpukat",
      description: "Jus alpukat segar dengan susu kental manis",
      imagePath: "/images/jus-alpukat.jpg",
      price: 18000,
      discount: 2000,
    },
    {
      categoryId: categoriesData[1].id,
      name: "Es Jeruk",
      description: "Jeruk peras segar dengan es batu",
      imagePath: "/images/es-jeruk.jpg",
      price: 10000,
      discount: 0,
    },

    // Snack & Cemilan
    {
      categoryId: categoriesData[2].id,
      name: "Kentang Goreng",
      description: "Kentang goreng crispy dengan saus pilihan",
      imagePath: "/images/kentang-goreng.jpg",
      price: 20000,
      discount: 0,
    },
    {
      categoryId: categoriesData[2].id,
      name: "Pisang Goreng",
      description: "Pisang goreng crispy dengan keju dan coklat",
      imagePath: "/images/pisang-goreng.jpg",
      price: 15000,
      discount: 0,
    },

    // Dessert
    {
      categoryId: categoriesData[3].id,
      name: "Es Krim",
      description: "Es krim dengan berbagai pilihan rasa",
      imagePath: "/images/es-krim.jpg",
      price: 20000,
      discount: 0,
    },
    {
      categoryId: categoriesData[3].id,
      name: "Pudding Coklat",
      description: "Pudding coklat lembut dengan saus vanilla",
      imagePath: "/images/pudding.jpg",
      price: 15000,
      discount: 3000,
    },
  ];

  await db.insert(menus).values(menusData);
  console.log("✅ Menus seeded!");

  console.log("🎉 Seeding complete!");
  await connection.end();
}

seed().catch((err) => {
  console.error("❌ Seeding failed!", err);
  process.exit(1);
});