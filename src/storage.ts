import * as fs from 'fs';

interface Note {
    id: number;
    title: string;
    content: string;
    date: string;
    words: number;
}

interface NotesData {
    notes: Note[];
}

function readNotesData(): NotesData {
    const notesFilePath = 'notes.json';
    try {
        const fileData = fs.readFileSync(notesFilePath, 'utf-8');
        return JSON.parse(fileData);
    } catch (error) {
        return { notes: [] };
    }
}

function writeNotesData(notesData: NotesData): void {
    const notesFilePath = 'notes.json';
    fs.writeFileSync(notesFilePath, JSON.stringify(notesData, null, 2));
}

function addNote(title: string, content: string, date: string, totalWords: number): void {
    const notesData = readNotesData();

    const newNote: Note = {
        id: notesData.notes.length + 1,
        title,
        content,
        date,
        words: totalWords
    };

    notesData.notes.push(newNote);
    writeNotesData(notesData);

    console.log('Note added successfully!');
}

function deleteNoteById(id: number): void {
    const notesData = readNotesData();

    const index = notesData.notes.findIndex(note => note.id === id);
    if (index !== -1) {
        notesData.notes.splice(index, 1);
        writeNotesData(notesData);
        console.log('Note deleted successfully!');
    } else {
        console.log('Note not found!');
    }
}

function modifyNoteById(id: number, newTitle: string, newContent: string, newDate: string, newTotalWords: number): void {
    const notesData = readNotesData();

    const index = notesData.notes.findIndex(note => note.id === id);
    if (index !== -1) {
        notesData.notes[index].title = newTitle;
        notesData.notes[index].content = newContent;
        notesData.notes[index].date = newDate;
        notesData.notes[index].words = newTotalWords;
        writeNotesData(notesData);
        console.log('Note modified successfully!');
    } else {
        console.log('Note not found!');
    }
}

// Example usage:
addNote("New Note", "This is a new note.", "2024-06-10", 6);
deleteNoteById(1); // Delete note with ID 1
modifyNoteById(2, "Modified Note", "This is a modified note.", "2024-06-11", 7); // Modify note with ID 2
