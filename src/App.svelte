<script>
  import { openDB } from 'idb';

  let notes = [];
  let newNote = '';

  // Open IndexedDB
  const dbPromise = openDB('notes-db', 1, {
    upgrade(db) {
      db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
    }
  });

  // Fetch all notes from IndexedDB
  async function fetchNotes() {
    const db = await dbPromise;
    notes = await db.getAll('notes');
  }

  // Add a new note
  async function addNote() {
    if (newNote.trim()) {
      const db = await dbPromise;
      await db.add('notes', { text: newNote });
      newNote = '';
      fetchNotes();
    }
  }

  // Delete a note
  async function deleteNote(id) {
    const db = await dbPromise;
    await db.delete('notes', id);
    fetchNotes();
  }

  // Fetch notes on component mount
  fetchNotes();
</script>

<main class="max-w-xl mx-auto p-6 font-sans">
  <h1 class="text-3xl font-bold mb-4">My Notes</h1>
  <div class="flex mb-4">
    <input 
      bind:value={newNote} 
      placeholder="Add a new note..." 
      class="flex-grow p-2 border rounded mr-2"
    />
    <button 
      on:click={addNote} 
      class="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Add Note
    </button>
  </div>

  <ul class="list-none p-0">
    {#each notes as note (note.id)}
      <li class="flex justify-between items-center p-2 border-b">
        <span>{note.text}</span>
        <button 
          on:click={() => deleteNote(note.id)} 
          class="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete
        </button>
      </li>
    {/each}
  </ul>
</main>

<style>
  /* Tailwind CSS is used for styling */
</style>
