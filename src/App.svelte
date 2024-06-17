<script>
  let notes = [];
  let newNote = '';

  function addNote() {
    if (newNote.trim() !== '') {
      notes = [...notes, newNote];
      newNote = '';
    }
  }

  function deleteNote(index) {
    notes = notes.filter((_, i) => i !== index);
  }
</script>

<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    font-family: Arial, sans-serif;
  }

  h1 {
    text-align: center;
  }

  .note-input {
    display: flex;
    margin-bottom: 1rem;
  }

  .note-input input {
    flex: 1;
    padding: 0.5rem;
    font-size: 1rem;
  }

  .note-input button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    margin-left: 0.5rem;
    cursor: pointer;
  }

  .notes {
    list-style: none;
    padding: 0;
  }

  .note {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f9f9f9;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border-radius: 5px;
  }

  .note button {
    background: red;
    color: white;
    border: none;
    padding: 0.3rem 0.6rem;
    cursor: pointer;
  }
</style>

<div class="container">
  <h1>Note App</h1>
  <div class="note-input">
    <input
      type="text"
      bind:value={newNote}
      placeholder="Enter a new note"
      on:keypress={(e) => e.key === 'Enter' && addNote()}
    />
    <button on:click={addNote}>Add</button>
  </div>
  <ul class="notes">
    {#each notes as note, index}
      <li class="note">
        <span>{note}</span>
        <button on:click={() => deleteNote(index)}>Delete</button>
      </li>
    {/each}
  </ul>
</div>