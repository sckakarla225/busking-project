const env = Deno.env.toObject();

export const APP_PORT = env.APP_PORT || 8000;
export const DB_URI = env.DB_URI || "mongodb+srv://sckakarla36:Chinnari5@busking-project.hpucowa.mongodb.net/?retryWrites=true&w=majority";
export const REDIS_HOST = env.REDIS_HOST || "localhost";
export const REDIS_PORT = env.REDIS_PORT || 6379;