import { openDB } from 'idb';

const dbPromise = openDB('notes-db', 1, {
  upgrade(db) {
    db.createObjectStore('notes', {
      keyPath: 'id',
      autoIncrement: true,
    });
  },
});

export async function saveNoteToDB(note) {
  const db = await dbPromise;
  await db.put('notes', note);
}

export async function getNoteFromDB() {
  const db = await dbPromise;
  return await db.getAll('notes');
}

export async function deleteNoteFromDB(id) {
  const db = await dbPromise;
  await db.delete('notes', id);
}
