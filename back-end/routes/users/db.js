import {MongoClient} from "mongodb";
const connectionString = 'mongodb://127.0.0.1:27017'; 
export const client = new MongoClient(connectionString);

export async function connect() {
  try {
    await client.connect();
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
  } 
}