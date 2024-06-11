
import { openDB } from 'idb';

const DB_NAME = 'notes-db';
const STORE_NAME = 'notes';

async function initDB() {
  console.log('Initializing IndexedDB...');
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.log('Creating object store...');
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
  return db;
}

export async function getAllNotes() {
  console.log('Fetching all notes...');
  const db = await initDB();
  const notes = await db.getAll(STORE_NAME);
  console.log('Fetched notes:', notes);
  return notes;
}

export async function getNoteById(id) {
  console.log('Fetching note by ID:', id);
  const db = await initDB();
  const note = await db.get(STORE_NAME, id);
  console.log('Fetched note:', note);
  return note;
}

export async function addNote(title, note) {
  console.log('Adding note:', { title, note });
  const db = await initDB();
  const id = await db.add(STORE_NAME, { title, note });
  console.log('Added note with ID:', id);
  return id;
}

export async function updateNote(id, title, note) {
  console.log('Updating note:', { id, title, note });
  const db = await initDB();
  const result = await db.put(STORE_NAME, { id, title, note });
  console.log('Updated note result:', result);
  return result;
}

export async function deleteNoteById(id) {
  console.log('Deleting note by ID:', id);
  const db = await initDB();
  const result = await db.delete(STORE_NAME, id);
  console.log('Deleted note result:', result);
  return result;
}
