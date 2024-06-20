import Dexie from "dexie";

const db = new Dexie("NotesDatabase");

db.version(1).stores({
  pages: "++id, title",
  notes: "++id, content, pageId",
});

const pagesTable = db.table("pages");
const notesTable = db.table("notes");

export const getPages = async () => {
  const pages = await pagesTable.toArray();
  const notes = await notesTable.toArray();
  return pages.map((page) => ({
    ...page,
    note: notes.find((note) => note.pageId === page.id)?.content || "",
  }));
};

export const saveNote = async (pageId, note) => {
  let existingNote = await notesTable.where({ pageId }).first();

  if (existingNote) {
    await notesTable.update(existingNote.id, { content: note });
  } else {
    await notesTable.add({
      content: note,
      pageId,
    });
  }
};

export const deleteNote = async (pageId) => {
  const existingNote = await notesTable.where({ pageId }).first();
  if (existingNote) {
    await notesTable.delete(existingNote.id);
  }
  await pagesTable.delete(pageId);
};

export const addPage = async (title) => {
  return await pagesTable.add({ title });
};

export const updatePageTitle = async (id, newTitle) => {
  return await pagesTable.update(id, { title: newTitle });
};