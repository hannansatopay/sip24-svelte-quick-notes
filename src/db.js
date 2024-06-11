import { openDB } from 'idb';

const dbPromise = openDB('simple-notes-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('notes')) {
      db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
    }
  }
});

export const db = {
  getNotes: async () => (await dbPromise).getAll('notes'),
  addNote: async (note) => (await dbPromise).add('notes', note),
  deleteNote: async (id) => (await dbPromise).delete('notes', id)
};
