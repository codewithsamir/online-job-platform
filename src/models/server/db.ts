import { db } from "../name";
import { databases } from "./config";

// Import all collection creation functions for the job platform
import createJobsCollection from "./jobdata";
import createApplicationsCollection from "./applications";
import createCompaniesCollection from "./companies";
import createCandidatesCollection from "./candidates";
import createNotificationsCollection from "./notifications";
import createReviewsCollection from "./review";

// Array of collection creation functions
const collectionCreators = [
  createJobsCollection,
  createApplicationsCollection,
  createCompaniesCollection,
  createCandidatesCollection,
  createNotificationsCollection,
  createReviewsCollection,
];

export default async function getOrCreateDB() {
  try {
    // Check if the database already exists
    await databases.get(db);
    console.log("Database connection established.");
  } catch (error) {
    console.warn("Database does not exist. Attempting to create it...");
    try {
      // Create the database
      await databases.create(db, db);
      console.log("Database created successfully.");

      // Create all collections dynamically
      for (const createCollection of collectionCreators) {
        try {
          await createCollection();
          console.log(`Collection created: ${createCollection.name}`);
        } catch (collectionError) {
          console.error(`Error creating collection: ${createCollection.name}`, collectionError);
        }
      }

      console.log("All collections created successfully.");
    } catch (dbError) {
      console.error("Error creating database:", dbError);
      throw dbError; // Re-throw the error to handle it upstream if needed
    }
  }

  return databases;
}