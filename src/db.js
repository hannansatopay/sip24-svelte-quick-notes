// src/db.js
import { openDB } from 'idb';

const dbPromise = openDB('Notes-app', 1, {
  upgrade(db) {
    db.createObjectStore('notes', { keyPath: 'title' });
  }
});

export const getAllPages = async () => {
  const db = await dbPromise;
  return db.getAllKeys('notes');
};

export const saveNote = async (title, note) => {
  const db = await dbPromise;
  return db.put('notes', { title, note });
};

export const getNote = async (title) => {
  const db = await dbPromise;
  const note = await db.get('notes', title);
  return note ? note.note : '';
};

export const deleteNote = async (title) => {
  const db = await dbPromise;
  return db.delete('notes', title);
};
