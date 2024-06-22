// db.js
import Dexie from 'dexie';

export const db = new Dexie('NotesDatabase');
db.version(1).stores({
  pages: '++id, title',
  notes: 'title, content'
});

export async function savePage(page) {
  return db.pages.put(page);
}

export async function saveNote(note) {
  return db.notes.put(note);
}

export async function getNotes() {
  return db.notes.toArray();
}

export async function getPages() {
  return db.pages.toArray();
}

export async function deletePage(title) {
  await db.notes.where('title').equals(title).delete();
  return db.pages.where('title').equals(title).delete();
}
