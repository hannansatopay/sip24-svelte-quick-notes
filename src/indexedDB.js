import { openDB } from 'idb';

const DB_NAME = 'notes-app';
const STORE_NAME = 'notes';

export async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'title' });
    }
  });
}

export async function getAllNotes() {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function getNoteTitle(title) {
  const db = await getDB();
  return db.get(STORE_NAME, title);
}

export async function saveNoteTitle(note) {
  const db = await getDB();
  // return db.put(STORE_NAME, { title: note.title, note: note.note });
  return db.put(STORE_NAME, note);
}

export async function deleteNoteTitle(title) {
  const db = await getDB();
  return db.delete(STORE_NAME, title);
}