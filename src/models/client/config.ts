import env from "@/app/env";

import { Client, Account, Avatars, Databases, Storage } from "appwrite";


const client = new Client()
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId); // Your project ID

const databases = new Databases(client)
const account = new Account(client);
const avatars = new Avatars(client);
const storage = new Storage(client);


//job collection on show real times
client.subscribe('databases.job_platform.collections.jobs.documents', (response) => {
    console.log('New update on Jobs collection:', response);
});

client.subscribe('databases.job_platform.collections.notifications.documents', (response) => {
    console.log('New Notification Received:', response);
});




export { client, databases, account, avatars, storage}