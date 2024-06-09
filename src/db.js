import { openDB } from 'idb';

const DB_NAME = 'notesDB';
const DB_VERSION = 1;
const PAGES_STORE = 'pages';
const NOTES_STORE = 'notes';

export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore(PAGES_STORE, { keyPath: 'id', autoIncrement: true });
      db.createObjectStore(NOTES_STORE);
    },
  });
  return db;
};

export const getPages = async (db) => {
  return await db.getAll(PAGES_STORE);
};

export const savePage = async (db, page) => {
  return await db.put(PAGES_STORE, page);
};

export const deletePage = async (db, id) => {
  return await db.delete(PAGES_STORE, id);
};

export const saveNote = async (db, title, note) => {
  return await db.put(NOTES_STORE, note, title);
};

export const getNote = async (db, title) => {
  return await db.get(NOTES_STORE, title);
};

export const deleteNote = async (db, title) => {
  return await db.delete(NOTES_STORE, title);
};
