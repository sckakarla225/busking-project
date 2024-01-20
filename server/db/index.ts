import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

const uri = "mongodb+srv://sckakarla36:Chinnari5@busking-project.hpucowa.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient();
client.connect(uri);

const db = client.database('busking-project');

export default db;