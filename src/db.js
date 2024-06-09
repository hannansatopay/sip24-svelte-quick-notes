import Dexie from 'dexie';

export const db = new Dexie("notesApp");

/*
    database name notesApp with table name stickyNotes with fields primary key id,
    field title and note created.
*/
db.version(1).stores(
    {
        stickyNotes:'++id, title, note'
    }
)