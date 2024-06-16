// src/db.js
import Dexie from 'dexie';

class NotesDatabase extends Dexie {
  pages;

  constructor() {
    super('notesDatabase');
    this.version(1).stores({
      pages: '++id, title, note'
    });
    this.pages = this.table('pages');
  }
}

const db = new NotesDatabase();

export default db;
