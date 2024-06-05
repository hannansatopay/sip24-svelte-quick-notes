<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let notes = [];
  let title = '';
  let message = '';
  let activeNoteId = null;
  let darkMode = false;

  async function initDB() {
    db = await openDB('notes-db', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
      },
    });
  }

  async function loadNotes() {
    notes = await db.getAll('notes');
  }

  async function addNote() {
    if (title && message) {
      await db.add('notes', { title, message });
      title = '';
      message = '';
      loadNotes();
    }
  }

  async function deleteNote(id) {
    await db.delete('notes', id);
    loadNotes();
    if (activeNoteId === id) {
      activeNoteId = null;
    }
  }

  function toggleNoteVisibility(id) {
    activeNoteId = activeNoteId === id ? null : id;
  }

  function toggleDarkMode() {
    darkMode = !darkMode;
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  onMount(async () => {
    await initDB();
    loadNotes();
  });
</script>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    transition: background-color 0.3s, color 0.3s;
    background-color: #f0f0f0;
    color: #000;
  }

  :global(.dark-mode) {
    background-color: #121212;
    color: #ffffff;
  }

  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    font-family: Arial, sans-serif;
    padding: 20px;
  }

  input, textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1em;
  }

  .dark-mode input, .dark-mode textarea {
    background-color: #333;
    border-color: #555;
    color: #fff;
  }

  textarea {
    height: 100px;
    max-height: 300px;
    resize: vertical;  
  }

  button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;
    font-size: 1em;
  }

  .dark-mode button {
    background-color: #0056b3;
  }

  button:hover {
    background-color: #0056b3;
  }

  .dark-mode button:hover {
    background-color: #004494;
  }

  .note {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    position: relative;
    cursor: pointer;
  }

  .dark-mode .note {
    border-color: #555;
    background-color: #222;
  }

  .note h2 {
    margin: 0;
    font-size: 1.2em;
  }

  .note p {
    margin: 10px 0 0;
    font-size: 1.1em;  
  }

  .note button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: red;
    color: white;
    border: none;
    padding: 5px;
    border-radius: 3px;
    cursor: pointer;
  }

  .note button:hover {
    background: darkred;
  }

  @media (max-width: 600px) {
    .container {
      padding: 10px;
    }
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
  }

  header h1 {
    margin: 0;
    font-size: 2em;
  }

  .toggle-dark-mode {
    padding: 10px 20px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .toggle-dark-mode:hover {
    background-color: #555;
  }
</style>

<div class="container {darkMode ? 'dark-mode' : ''}">
  <header>
    <h1 style="font-weight: bold;">Note App</h1>
    <button class="toggle-dark-mode" on:click={toggleDarkMode}>
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  </header>
  <input type="text" bind:value={title} placeholder="Title" />
  <textarea bind:value={message} placeholder="Message"></textarea>
  <button on:click={addNote} style="margin: auto; margin-bottom: 1em;">Add Note</button>

  {#each notes as note, index}
    <div class="note" role="button" tabindex="0" on:click={() => toggleNoteVisibility(note.id)} on:keydown={(e) => e.key === 'Enter' && toggleNoteVisibility(note.id)}>
      <h2>{index + 1}. {note.title}</h2>
      {#if activeNoteId === note.id}
        <p>{note.message}</p>
      {/if}
      <button on:click={() => deleteNote(note.id)}>Delete</button>
    </div>
  {/each}
</div>
