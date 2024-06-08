// src/db.js
import { openDB } from 'idb';

const DB_NAME = 'notes-db';
const DB_VERSION = 1;
const STORE_NAME = 'notes';

const initDB = async () => {
const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    }
    }
});
return db;
};

export const getNotes = async () => {
const db = await initDB();
return await db.getAll(STORE_NAME);
};

export const getNote = async (id) => {
const db = await initDB();
return await db.get(STORE_NAME, id);
};

export const addNote = async (note) => {
const db = await initDB();
return await db.add(STORE_NAME, note);
};

export const updateNote = async (note) => {
const db = await initDB();
return await db.put(STORE_NAME, note);
};

export const deleteNote = async (id) => {
const db = await initDB();
return await db.delete(STORE_NAME, id);
};