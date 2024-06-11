// src/db.js
import { openDB } from 'idb';

const DB_NAME = 'notesApp';
const STORE_NAME = 'notes';

const dbPromise = openDB(DB_NAME, 1, {
upgrade(db) {
    db.createObjectStore(STORE_NAME, { keyPath: 'title' });
},
});

export async function getNotes() {
const db = await dbPromise;
return db.getAll(STORE_NAME);
}

export async function getNoteByTitle(title) {
const db = await dbPromise;
return db.get(STORE_NAME, title);
}

export async function saveNote(note) {
const db = await dbPromise;
return db.put(STORE_NAME, note);
}

export async function deleteNoteByTitle(title) {
const db = await dbPromise;
return db.delete(STORE_NAME, title);
}
