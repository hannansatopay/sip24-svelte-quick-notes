// dexie.js
import Dexie from 'dexie';

// Create the database
const db = new Dexie('NotesDatabase');

// Define a schema
db.version(1).stores({
  notes: 'title,note' // Define the primary key and indexed properties
});

// Define functions to interact with the database
export async function saveNoteToDB(title, note) {
  await db.notes.put({ title, note });
}

export async function getNoteFromDB(title) {
  return await db.notes.get(title);
}

export async function deleteNoteFromDB(title) {
  await db.notes.delete(title);
}   

export async function getAllNotes() {
  return await db.notes.toArray();
}

export default db;
