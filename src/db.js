import Dexie from 'dexie';

// Create a new database
const db = new Dexie('notesDB');

// Define the database schema
db.version(1).stores({
  pages: '++id, title',
  notes: 'title, content'
});

export default db;
