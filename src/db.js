import Dexie from 'dexie';

const db = new Dexie('notesDatabase');
db.version(1).stores({
  notes: '++id, title, content',
  pages: '++id, title'
});

export async function saveNoteToDB(title, content) {
  // @ts-ignore
  const note = await db.notes.get({ title });
  if (note) {
    // @ts-ignore
    await db.notes.update(note.id, { content });
  } else {
    // @t
    // @ts-ignore
    await db.notes.add({ title, content });
  }
}

export async function loadNoteFromDB(title) {
  // @ts-ignore
  const note = await db.notes.get({ title });
  return note ? note.content : '';
}

export async function deleteNoteFromDB(title) {
  // @ts-ignore
  await db.notes.where('title').equals(title).delete();
}

export async function savePagesToDB(pages) {
  // @ts-ignore
  await db.pages.clear();
  // @ts-ignore
  await db.pages.bulkAdd(pages.map(title => ({ title })));
}

export async function loadPagesFromDB() {
  // @ts-ignore
  const pages = await db.pages.toArray();
  return pages.map(page => page.title);
}
