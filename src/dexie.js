import Dexie from 'dexie';

const db = new Dexie('NotesDatabase');
db.version(1).stores({
  notes: 'title,note'
});

export async function saveNoteToIndexedDB(title, note) {
  await db.notes.put({ title, note });
}

export async function getNoteFromIndexedDB(title) {
  return await db.notes.get(title);
}

export async function deleteNoteFromIndexedDB(title) {
  await db.notes.delete(title);
}

export async function getAllTitlesFromIndexedDB() {
  return await db.notes.toArray();
}

export default db;