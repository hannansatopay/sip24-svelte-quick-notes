// src/indexedDB.js
import { openDB } from 'idb';

export const dbPromise = openDB('notes-db', 1, {
  upgrade(db) {
    db.createObjectStore('notes', {
      keyPath: 'title',
    });
  },
});

export async function getNote(title) {
  const db = await dbPromise;
  return db.get('notes', title);
}

export async function saveNoteToDB(note) {
  const db = await dbPromise;
  return db.put('notes', note);
}

export async function deleteNoteFromDB(title) {
  const db = await dbPromise;
  return db.delete('notes', title);
}

export async function getAllNotes() {
  const db = await dbPromise;
  return db.getAll('notes');
}
