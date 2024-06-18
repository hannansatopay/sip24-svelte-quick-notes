import { openDB } from 'idb';

const DB_NAME ='ToDoDB';
const STORE_NAME ='ToDo';

const dbPromise = openDB(DB_NAME, 1, {
    upgrade(db){
        db.createObjectStore(STORE_NAME, { keyPath: 'title'});
    }
})

export async function getNotes() {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
}

export async function getNotesFromTitle(title) {
    const db = await dbPromise;
    return db.get(STORE_NAME, title);
}

export async function saveNote(note) {
    const db = await dbPromise;
    return db.put(STORE_NAME, note);
}

export async function deleteNoteFromTitle(title) {
    const db = await dbPromise;
    return db.delete(STORE_NAME, title);
}