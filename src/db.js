// src/db.js
import Dexie from 'dexie';

export const db = new Dexie('NoteDB');

db.version(1).stores({
  notes: '++id, title, content',
});

db.open().catch((err) => {
  console.error('Failed to open db:', err.stack || err);
});
