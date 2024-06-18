// src/dexie.js
import Dexie from 'dexie';

const db = new Dexie('notesDatabase');
db.version(1).stores({
  notes: '++id, title, content'
});

export default db;
