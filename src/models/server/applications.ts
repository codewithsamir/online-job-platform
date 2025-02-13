import { Permission } from "node-appwrite";
import { applications, db } from "../name";
import { databases } from "./config";

export default async function createApplicationsCollection() {
    await databases.createCollection(db, applications, applications, [
        Permission.create("users"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);
    console.log("Applications Collection Created");

    await Promise.all([
        databases.createStringAttribute(db, 'applications', 'jobId', 100, true),
        databases.createStringAttribute(db, 'applications', 'candidateId', 100, true),
        databases.createStringAttribute(db, 'applications', 'resumeUrl', 500, true),
        databases.createStringAttribute(db, 'applications', 'coverLetter', 1000, false),
        databases.createStringAttribute(db, 'applications', 'applicationDate', 100, true),
        databases.createStringAttribute(db, 'applications', 'status', 100, true),
    ]);
    console.log("Applications Attributes Created");
}