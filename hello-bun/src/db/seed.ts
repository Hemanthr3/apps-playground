import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { products } from "./schema";

const sqlite = new Database(process.env.DB_FILE_NAME || "sqlite.db");
const db = drizzle(sqlite);

async function seed() {
  console.log("Seeding products...");

  const productData = [
    {
      sku: "PROD-001",
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse",
      price: 25.99,
      stockQuantity: 100,
    },
    {
      sku: "PROD-002",
      name: "Mechanical Keyboard",
      description: "RGB Backlit mechanical keyboard",
      price: 89.99,
      stockQuantity: 50,
    },
    {
      sku: "PROD-003",
      name: "USB-C Hub",
      description: "7-in-1 USB-C connectivity hub",
      price: 45.50,
      stockQuantity: 75,
    },
  ];

  for (const product of productData) {
    await db
      .insert(products)
      .values(product)
      .onConflictDoUpdate({
        target: products.sku,
        set: product,
      });
  }

  console.log("Seeding completed!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
