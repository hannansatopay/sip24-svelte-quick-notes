import Dexie from 'dexie';
class NotesDatabase extends Dexie {
  notes;

  constructor() {
    super('notesDatabase');
    this.version(1).stores({
      notes: '++id, title, content' 
    });
    this.notes = this.table('notes');
  }
}

const db = new NotesDatabase();
export default db;
