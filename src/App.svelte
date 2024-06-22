<script>
  import { writable } from 'svelte/store';

  let notes = writable([]);

  let newNoteTitle = '';
  let newNoteContent = '';

  function addNote() {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      notes.update(n => [...n, { id: Date.now(), title: newNoteTitle, content: newNoteContent }]);
      newNoteTitle = '';
      newNoteContent = '';
    }
  }

  function deleteNote(id) {
    notes.update(n => n.filter(note => note.id !== id));
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
