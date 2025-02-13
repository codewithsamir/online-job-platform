import { databases } from "./config";
import { db, notifications } from "../name";
import { Permission } from "node-appwrite";

export default async function createNotificationsCollection() {
  try {
    await databases.createCollection(db, notifications, notifications, [
      Permission.create("users"),
      Permission.read("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ]);
    console.log("Notifications Collection Created");

    await Promise.all([
      databases.createStringAttribute(db, notifications, "userId", 100, true),
      databases.createStringAttribute(db, notifications, "message", 1000, true),
      databases.createStringAttribute(db, notifications, "type", 100, true),
      databases.createBooleanAttribute(db, notifications, "isRead", true),
      databases.createStringAttribute(db, notifications, "createdAt", 100, true),
    ]);
    console.log("Notifications Attributes Created");
  } catch (error) {
    console.error("Error creating Notifications collection:", error);
    throw error;
  }
}