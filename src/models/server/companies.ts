import { Permission } from "node-appwrite";
import { databases } from "./config";
import { companies, db } from "../name";

export default async function createCompaniesCollection() {
    await databases.createCollection(db, companies, companies, [
        Permission.create("users"),
        Permission.read("any"),
        Permission.read("users"),
        Permission.update("users"),
        Permission.delete("users"),
    ]);
    console.log("Companies Collection Created");

    await Promise.all([
        databases.createStringAttribute(db, 'companies', 'name', 250, true),
        databases.createStringAttribute(db, 'companies', 'description', 1000, false),
        databases.createStringAttribute(db, 'companies', 'industry', 250, true),
        databases.createStringAttribute(db, 'companies', 'website', 500, false),
        databases.createStringAttribute(db, 'companies', 'logoUrl', 500, false),
        databases.createStringAttribute(db, 'companies', 'logoId', 100, false),
        databases.createStringAttribute(db, 'companies', 'email', 250, true),
        databases.createStringAttribute(db, 'companies', 'createdBy', 100, true),
    ]);
    console.log("Companies Attributes Created");
}