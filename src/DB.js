import Dexie from 'dexie';

// Creating a new Dexie database
const db = new Dexie('NotesDatabase');

// Defining the schema

db.version(1).stores({
  notes: '++id, title, content'
});

export default db;
