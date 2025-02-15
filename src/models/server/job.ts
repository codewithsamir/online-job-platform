import { Permission } from "node-appwrite";
import { databases } from "./config";
import { db, jobs } from "../name";

export default async function createJobsCollection() {
    await databases.createCollection(db, jobs, jobs, [
        Permission.create("users"),
        Permission.read("any"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);
    console.log("Jobs Collection Created");

    await Promise.all([
        databases.createStringAttribute(db, 'jobs', 'title', 250, true),
        databases.createStringAttribute(db, 'jobs', 'description', 1000, true),
        databases.createStringAttribute(db, 'jobs', 'specification', 1000, true),
        databases.createStringAttribute(db, 'jobs', 'companyName', 250, true),
        databases.createStringAttribute(db, 'jobs', 'location', 250, true),
        databases.createStringAttribute(db, 'jobs', 'salaryRange', 100, false),
        databases.createStringAttribute(db, 'jobs', 'jobType', 100, true),
        databases.createStringAttribute(db, 'jobs', 'postedBy', 100, true),
        databases.createStringAttribute(db, 'jobs', 'postedDate', 100, true),
        databases.createStringAttribute(db, 'jobs', 'applicationDeadline', 100, true),
        databases.createBooleanAttribute(db, 'jobs', 'isActive', true),
    ]);
    console.log("Jobs Attributes Created");
}