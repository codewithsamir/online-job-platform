import { Permission } from "node-appwrite";
import { candidates, db } from "../name";
import { databases } from "./config";

export default async function createCandidatesCollection() {
    await databases.createCollection(db, candidates, candidates, [
        Permission.create("users"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);
    console.log("Candidates Collection Created");

    await Promise.all([
        databases.createStringAttribute(db, 'candidates', 'userId', 100, true),
        databases.createStringAttribute(db, 'candidates', 'fullName', 250, true),
        databases.createStringAttribute(db, 'candidates', 'gender', 250, true),
        databases.createStringAttribute(db, 'candidates', 'email', 250, true),
        databases.createStringAttribute(db, 'candidates', 'phone', 20, false),
        databases.createStringAttribute(db, 'candidates', 'dateofbirth', 100, false),
        databases.createStringAttribute(db, 'candidates', 'address', 200, false),
    
        databases.createStringAttribute(db, 'candidates', 'skills', 500, false),
        databases.createStringAttribute(db, 'candidates', 'experience', 100, false),
        databases.createStringAttribute(db, 'candidates', 'education', 250, false),
        databases.createStringAttribute(db, 'candidates', 'profileUrl', 200, false),
        databases.createStringAttribute(db, 'candidates', 'profileid', 100, false),
    ]);
    console.log("Candidates Attributes Created");
}