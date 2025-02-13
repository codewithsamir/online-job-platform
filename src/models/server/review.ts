import { databases } from "./config";
import { db, reviews } from "../name";
import { Permission } from "node-appwrite";

export default async function createReviewsCollection() {
  try {
    await databases.createCollection(db, reviews, reviews, [
      Permission.create("users"),
      Permission.read("any"),
      Permission.update("users"),
      Permission.delete("users"),
    ]);
    console.log("Reviews Collection Created");

    await Promise.all([
      databases.createStringAttribute(db, reviews, "companyId", 100, true),
      databases.createStringAttribute(db, reviews, "reviewerId", 100, true),
      databases.createIntegerAttribute(db, reviews, "rating", true),
      databases.createStringAttribute(db, reviews, "comment", 1000, false),
      databases.createStringAttribute(db, reviews, "createdAt", 100, true),
    ]);
    console.log("Reviews Attributes Created");
  } catch (error) {
    console.error("Error creating Reviews collection:", error);
    throw error;
  }
}