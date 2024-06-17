<script>
  import { onMount } from 'svelte';
  import NoteEditor from './Note.svelte';
  import { getNotes, addNote, updateNote, deleteNoteById } from './db';

  let notes = [];
  let selectedNote = null;

  // Load notes from IndexedDB
  onMount(async () => {
    notes = await getNotes();
  });

  // Add a new note
  async function addNewNote() {
    const newNote = { id: Date.now(), title: '', content: '', x: 0, y: 0 };
    await addNote(newNote);
    notes = await getNotes();
    selectNote(newNote);
  }

  // Update an existing note
  async function handleUpdate(event) {
    const updatedNote = event.detail;
    await updateNote(updatedNote);
    notes = await getNotes();
    selectedNote = null; // Close the note editor after saving
  }

  // Delete a note
  async function handleDelete(event) {
    const { id } = event.detail;
    await deleteNoteById(id);
    notes = await getNotes();
    selectedNote = null;
  }

  // Select a note for editing
  function selectNote(note) {
    selectedNote = note;
  }
</script>

<style>
  .container {
    display: flex;
    height: 100vh;
  }
  .notes-list {
    width: 30%;
    border-right: 1px solid #ccc;
    padding: 10px;
    overflow-y: auto;
  }
  .note-editor {
    width: 70%;
    padding: 10px;
  }
  .add-note-btn {
    margin: 10px;
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
  }
  .note-title {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #ccc;
  }
  .note-title:hover {
    background-color: #f0f0f0;
  }
  .selected-note {
    background-color: #e0e0e0;
    font-weight: bold;
  }
</style>

<div class="container">
  <div class="notes-list">
    <button class="add-note-btn" on:click={addNewNote}>Add Note</button>
    {#each notes as note (note.id)}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div 
        class="note-title {selectedNote && selectedNote.id === note.id ? 'selected-note' : ''}" 
        on:click={() => selectNote(note)}
      >
        {note.title || 'Untitled Note'}
      </div>
    {/each}
  </div>
  <div class="note-editor">
    {#if selectedNote}
      <NoteEditor {selectedNote} on:update={handleUpdate} on:delete={handleDelete} />
    {:else}
      <p>Select a note to edit </p>
    {/if}
  </div>
</div>
