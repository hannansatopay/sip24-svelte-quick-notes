<script>
  import { onMount } from "svelte";
  import { openDB } from "idb";

  let title = "";
  let note = "";
  let notes = [];

  const DB_NAME = "notes_db";
  const STORE_NAME = "notes";

  async function initDB() {
    return openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      },
    });
  }

  async function getAllNotes() {
    const db = await initDB();
    return db.getAll(STORE_NAME);
  }

  async function addNote(note) {
    const db = await initDB();
    return db.add(STORE_NAME, note);
  }

  async function deleteNote(id) {
    const db = await initDB();
    return db.delete(STORE_NAME, id);
  }

  async function saveNote() {
    if (title && note) {
      const newNote = { title, note };
      await addNote(newNote);
      notes = await getAllNotes();
      title = "";
      note = "";
    }
  }

  async function removeNote(id) {
    await deleteNote(id);
    notes = await getAllNotes();
  }

  function getRandomBgColor() {
    const colors = [
      "bg-slate-200",
      "bg-amber-200",
      "bg-orange-200",
      "bg-lime-200",
      "bg-violet-200",
      "bg-emerald-200",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  onMount(async () => {
    notes = await getAllNotes();
  });
</script>

<main class="center grid grid-cols-1 sm:grid-cols-3">
  <!-- Note input section -->
  <div class="px-4 py-10 bg-slate-900 col-span-1">
    <h1 class="text-4xl font-bold mb-4 text-white">Sticky Notes</h1>
    <hr class="mb-10" />
    <input
      bind:value={title}
      placeholder="Add Title"
      class="border p-2 w-full mb-2 rounded"
    />
    <textarea
      bind:value={note}
      placeholder="Add Note"
      class="border p-2 w-full h-40 mb-2 rounded"
    ></textarea>
    <button
      on:click={saveNote}
      class="bg-blue-500 text-white p-2 rounded w-full hover:bg-green-500"
      >Save</button
    >
  </div>

  <!-- Notes display section -->
  <div class="p-4 col-span-2">
    {#each notes as note (note.id)}
      <div class={"border p-4 rounded-lg mb-4 shadow-lg " + getRandomBgColor()}>
        <h3 class="font-bold text-lg text-blue-700">{note.title}</h3>
        <p class="m-2">{note.note}</p>
        <button
          on:click={() => removeNote(note.id)}
          class="bg-red-500 text-white p-1 rounded mt-2 hover:bg-red-700"
          >Delete</button
        >
      </div>
    {/each}
  </div>
</main>

<style>
</style>
