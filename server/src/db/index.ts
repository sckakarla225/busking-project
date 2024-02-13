import { MongoClient } from '../../deps.ts';
import { DB_URI } from '../config.ts';

// Setup
const client = new MongoClient();
client.connect(DB_URI);
const db = client.database("busking-project");

// Collections
const users = db.collection("users");
const spots = db.collection("spots");

export { users, spots };

