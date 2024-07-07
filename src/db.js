import Dexie from 'dexie';

const db = new Dexie('notesDatabase');
db.version(1).stores({
    pages: '++id, title, content'
});

export default db;