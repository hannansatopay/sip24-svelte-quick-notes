<script>
  // Array to hold the notes
  let notes = [];
  let newNote = '';

  // Function to add a new note
  function addNote() {
    if (newNote.trim() !== '') {
      notes = [...notes, { text: newNote, id: Date.now() }];
      newNote = '';
    }
  }

  // Function to delete a note
  function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
  }
</script>

<style>
  main {
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  input, button {
    font-size: 1rem;
    padding: 0.5rem;
    margin: 0.5rem 0;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin: 0.5rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  button {
    background-color: #ff4757;
    color: white;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: #e84118;
  }
</style>

<main>
  <h1>Notes App</h1>

  <input
    type="text"
    bind:value={newNote}
    placeholder="Enter a new note"
  />
  <button on:click={addNote}>Add Note</button>

  <ul>
    {#each notes as note (note.id)}
      <li>
        <span>{note.text}</span>
        <button on:click={() => deleteNote(note.id)}>Delete</button>
      </li>
    {/each}
  </ul>
</main>
