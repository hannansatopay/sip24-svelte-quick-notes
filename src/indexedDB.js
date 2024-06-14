import { openDB } from 'idb';

const dbName = 'notesDB';
const storeName = 'notesStore';

async function initDB() {
  const db = await openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  return db;
}

export async function getAllNotes() {
  const db = await initDB();
  return db.getAll(storeName);
}

export async function getNoteById(id) {
  const db = await initDB();
  return db.get(storeName, id);
}

export async function addNote(note) {
  const db = await initDB();
  return db.add(storeName, note);
}

export async function updateNote(note) {
  const db = await initDB();
  return db.put(storeName, note);
}

export async function deleteNoteById(id) {
  const db = await initDB();
  return db.delete(storeName, id);
}
