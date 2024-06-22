<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let db;
  let notes = writable([]);
  let newNoteTitle = '';
  let newNoteContent = '';

  onMount(async () => {
    const dbName = 'notepadDB';
    const dbVersion = 1;

    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = function(event) {
      console.error('Database error:', event.target.errorCode);
    };

    request.onsuccess = function(event) {
      db = event.target.result;
      fetchNotes();
    };

    request.onupgradeneeded = function(event) {
      db = event.target.result;
      db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
    };
  });

  async function fetchNotes() {
    const transaction = db.transaction(['notes'], 'readonly');
    const store = transaction.objectStore('notes');
    const request = store.getAll();

    request.onsuccess = function(event) {
      notes.set(event.target.result);
    };

    request.onerror = function(event) {
      console.error('Error fetching notes:', event.target.error);
    };
  }

  function addNote() {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const newNote = { title: newNoteTitle, content: newNoteContent };

      const request = store.add(newNote);

      request.onsuccess = function(event) {
        notes.update(n => [...n, { id: event.target.result, ...newNote }]);
        newNoteTitle = '';
        newNoteContent = '';
      };

      request.onerror = function(event) {
        console.error('Error adding note:', event.target.error);
      };
    }
  }

  function deleteNote(id) {
    const transaction = db.transaction(['notes'], 'readwrite');
    const store = transaction.objectStore('notes');

    const request = store.delete(id);

    request.onsuccess = function(event) {
      notes.update(n => n.filter(note => note.id !== id));
    };

    request.onerror = function(event) {
      console.error('Error deleting note:', event.target.error);
    };
  }
</script>

<main>
  <h1>Notepad</h1>

  <div class="note-form">
    <input type="text" placeholder="Title" bind:value={newNoteTitle} />
    <textarea placeholder="Content" bind:value={newNoteContent}></textarea>
    <button on:click={addNote}>Add Note</button>
  </div>

  <ul>
    {#each $notes as note (note.id)}
      <li>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
        <button on:click={() => deleteNote(note.id)}>Delete</button>
      </li>
    {/each}
  </ul>
</main>

<style>
  main {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    font-family: Arial, sans-serif;
  }

  h1 {
    text-align: center;
  }

  .note-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .note-form input,
  .note-form textarea {
    padding: 0.5rem;
    font-size: 1rem;
  }

  .note-form button {
    padding: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    border: 1px solid #ccc;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    position: relative;
  }

  li h2 {
    margin: 0 0 0.5rem 0;
  }

  li button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
    background: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 4px;
  }
</style>
