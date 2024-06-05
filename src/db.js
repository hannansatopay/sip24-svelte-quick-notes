import Dexie from 'dexie';

// Extend Dexie to define the table schema
class NotesDatabase extends Dexie {
  notes;

  constructor() {
    super('notesDatabase');
    this.version(1).stores({
      notes: '++id, title, content' // Auto-incrementing primary key and indexes on title and content
    });
    // Reference to the 'notes' table
    this.notes = this.table('notes');
  }
}

const db = new NotesDatabase();
export default db;