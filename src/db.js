// @ts-nocheck
import Dexie from 'dexie';

// Create a new Dexie database
const db = new Dexie('NotesDatabase');

// Define the database schema
db.version(1).stores({
  notes: '++id,title,content,x,y'
});

// Add a note
export async function addNote(note) {
  return await db.notes.add(note);
}

// Get all notes
export async function getNotes() {
  return await db.notes.toArray();
}

// Update a note
export async function updateNote(note) {
  return await db.notes.put(note);
}

// Delete a note by id
export async function deleteNoteById(id) {
  return await db.notes.delete(id);
}

export default db;
