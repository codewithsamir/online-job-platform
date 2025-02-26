import env from "@/app/env";

import { Client, Account, Avatars, Databases, Storage } from "appwrite";
import { jobs } from "../name";

const client = new Client()
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId); // Your project ID

const databases = new Databases(client)
const account = new Account(client);
const avatars = new Avatars(client);
const storage = new Storage(client);


//job collection on show real times
client.subscribe(jobs, (response) => {
    console.log('New update: on job collection', response);
});


export { client, databases, account, avatars, storage}