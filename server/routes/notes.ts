import { Context, RouterContext } from "https://deno.land/x/oak@v12.6.2/mod.ts";
import db from '../db/index.ts';

const notesCollection = db.collection('notes');

interface Note {
    _id?: string,
    title: string,
    body: string,
    date: Date
};

const getNotes = async (ctx: Context) => {
    const notes = await notesCollection.find();
    ctx.response.body = notes;
};

const getSingleNote = async (ctx: RouterContext<string>) => {
    const noteID = ctx.params.id;
    const note = await notesCollection.findOne({ _id: { $oid: noteID }});
    ctx.response.body = note;
};

const createNote = async (ctx: Context) => {
    const result = ctx.request.body();
    if (result.type == 'json') {
        const { title, body } = await result.value;
        const note: Note = { title, body, date: new Date() };
        const noteID = await notesCollection.insertOne(note);
        console.log(noteID);

        note._id = noteID;
        ctx.response.status = 201;
        ctx.response.body = note;
    }
};

const updateNote = async (ctx: RouterContext<string>) => {
    const noteID = ctx.params.id;
    const result = ctx.request.body();
    if (result.type == 'json') {
        const { title, body } = await result.value;
        const { modifiedCount } = await notesCollection.updateOne({ _id: { $oid: noteID }}, {
            $set: { title, body }
        });
        console.log(modifiedCount);
        if (!modifiedCount) {
            ctx.response.status = 404;
            ctx.response.body = 'Note does not exist.';
            return
        };
        ctx.response.body = await notesCollection.findOne({ _id: { $oid: noteID } });
    };
};

const deleteNote = async (ctx: RouterContext<string>) => {
    const noteID = ctx.params.id;
    const deleteCount = await notesCollection.deleteOne({ _id: { $oid: noteID }});
    console.log(deleteCount);
    if (!deleteCount) {
        ctx.response.status = 404;
        ctx.response.body = 'Note does not exist.';
        return
    }
    ctx.response.status = 402;
    ctx.response.body = 'Note deleted';
};

export { 
    getNotes,
    getSingleNote,
    createNote,
    updateNote,
    deleteNote 
};