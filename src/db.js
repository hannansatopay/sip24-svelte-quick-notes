// src/db.js
import { openDB } from 'idb';

const DB_NAME = 'NotesDB';
const DB_VERSION = 1;
const PAGES_STORE = 'pages';
const NOTES_STORE = 'notes';

async function initDB() {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore(PAGES_STORE, { keyPath: 'id', autoIncrement: true });
      db.createObjectStore(NOTES_STORE);
    },
  });
  return db;
}

export async function getPages() {
  const db = await initDB();
  return await db.getAll(PAGES_STORE);
}

export async function savePage(id, title) {
    const db = await initDB();
    if (id) {
      await db.put(PAGES_STORE, { id, title });
    } else {
      return await db.add(PAGES_STORE, { title });
    }
  }

export async function deletePage(id) {
  const db = await initDB();
  await db.delete(PAGES_STORE, id);
  await db.delete(NOTES_STORE, id);
}

export async function saveNote(id, note) {
  const db = await initDB();
  await db.put(NOTES_STORE, note, id);
}

export async function getNote(id) {
  const db = await initDB();
  return await db.get(NOTES_STORE, id);
}
