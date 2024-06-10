<script>
 
  import { onMount } from "svelte";
  import { openDB } from "idb";
  let db;
  let title = "";
  let description = "";
  let notes = [];
  let selectedNoteId = null;
  const initDB = async () => {
    db = await openDB("notes-db", 1, {
      upgrade(db) {
        db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
      },
    });
    loadNotes();
  };
  const loadNotes = async () => {
    notes = await db.getAll("notes");
    if (notes.length > 0 && !selectedNoteId) {
      selectNote(notes[0]);
    } else if (selectedNoteId) {
      const selectedNote = notes.find(note => note.id === selectedNoteId);
      if (selectedNote) {
        title = selectedNote.title;
        description = selectedNote.description;
      } else {
        selectedNoteId = null;
        title = "";
        description = "";
      }
    }
  };
  const addNote = async () => {
    const id = await db.add("notes", { title, description });
    title = "";
    description = "";
    selectedNoteId = id;
    loadNotes();
  };
  const deleteNote = async (id) => {
    await db.delete("notes", id);
    if (id === selectedNoteId) {
      selectedNoteId = null;
      title = "";
      description = "";
    }
    loadNotes();
  };
  const selectNote = (note) => {
    selectedNoteId = note.id;
    title = note.title;
    description = note.description;
  };
  onMount(() => {
    initDB();
  });
</script>

<main>
  Hello World
<main class="flex">
  <!-- Sidebar -->
  <aside class="w-1/4 bg-gray-200 p-4">
    <h2 class="text-xl font-bold mb-4">Notes</h2>
    <button class="bg-blue-500 text-white px-4 py-2 rounded mb-4" on:click="{() => { title = ''; description = ''; selectedNoteId = null; }}">
      Add Page
    </button>
    {#each notes as note}
      <div class="mb-2 flex justify-between items-center">
        <button
          class="text-left w-full px-2 py-1 rounded"
          class:bg-gray-300={note.id === selectedNoteId}
          on:click={() => selectNote(note)}
        >
          {note.title}
        </button>
        <button class="bg-red-500 text-white px-2 py-1 rounded ml-2" on:click={() => deleteNote(note.id)}>
          Delete
        </button>
      </div>
    {/each}
  </aside>

  <!-- Note Editor -->
  <section class="w-3/4 p-4">
    <h2 class="text-xl font-bold mb-4">Edit Note</h2>
    <input type="text" class="border p-2 mb-4 w-full" bind:value={title} placeholder="Title" />
    <textarea class="border p-2 mb-4 w-full" bind:value={description} placeholder="Description"></textarea>
    <button class="bg-green-500 text-white px-4 py-2 rounded" on:click={addNote}>
      Save
    </button>
  </section>
</main>

<style>
</style>
  main {
    height: 100vh;
  }
  button:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
</style>
