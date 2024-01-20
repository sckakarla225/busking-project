import { Application, Router } from "https://deno.land/x/oak@v12.6.2/mod.ts";
import { getNotes, getSingleNote, createNote, updateNote, deleteNote } from './routes/index.ts';

const app = new Application();
const router = new Router();

router
    .get('/', (ctx) => {
        ctx.response.body = 'Busking Project API';
    })
    .get('/notes', getNotes)
    .get('/notes/:id', getSingleNote)
    .post('/notes', createNote)
    .put('/notes/:id', updateNote)
    .delete('/notes/:id', deleteNote);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8000 });
console.log("server is running");

