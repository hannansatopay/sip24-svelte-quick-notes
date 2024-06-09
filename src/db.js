import { openDB } from 'idb';

const DB_NAME = 'notesDB';
const STORE_NAME = 'pages';

async function initDB() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    }
  });
  return db;
}

export async function getPages() {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
}

export async function getPage(id) {
  const db = await initDB();
  return await db.get(STORE_NAME, id);
}

export async function savePage(page) {
  const db = await initDB();
  return await db.put(STORE_NAME, page);
}

export async function deletePage(id) {
  const db = await initDB();
  return await db.delete(STORE_NAME, id);
}