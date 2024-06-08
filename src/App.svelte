<script>
  import { onMount } from "svelte";
  import { openDB } from "idb";

  let title = "";
  let note = "";
  let notes = [];
  let editId = null;

  const DB_NAME = "notes_db";
  const STORE_NAME = "notes";

  let showModal = false;
  let noteToDelete = null;

  function confirmDelete(note) {
    showModal = true;
    noteToDelete = note;
  }

  async function confirmDeleteNote() {
    if (noteToDelete) {
      await deleteNote(noteToDelete.id);
      notes = await getAllNotes();
      closeModal();
    }
  }

  function closeModal() {
    showModal = false;
    noteToDelete = null;
  }

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

  async function updateNote(note) {
    const db = await initDB();
    return db.put(STORE_NAME, note);
  }

  async function deleteNote(id) {
    const db = await initDB();
    return db.delete(STORE_NAME, id);
  }

  async function saveNote() {
    if (title && note) {
      if (editId === null) {
        const newNote = { title, note, timestamp: new Date().toLocaleString() };
        await addNote(newNote);
      } else {
        const updatedNote = {
          id: editId,
          title,
          note,
          timestamp: new Date().toLocaleString(),
        };
        await updateNote(updatedNote);
        editId = null;
      }
      notes = await getAllNotes();
      title = "";
      note = "";
    }
  }

  async function removeNote(id) {
    await deleteNote(id);
    notes = await getAllNotes();
  }

  function editNote(note) {
    editId = note.id;
    title = note.title;
    note = note.note;
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

<main class="center grid sm:grid-cols-3">
  <!-- Note input section -->
  <div class="px-4 py-10 bg-slate-900 col-span-1">
    <h1 class="text-4xl font-bold mb-4 text-white">Sticky Notes</h1>
    <hr class="mb-10 border-gray-500" />
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
      class="bg-blue-500 text-white p-2 rounded w-full hover:bg-green-500 transition-colors duration-300"
      >{editId === null ? "Save" : "Update"}</button
    >
  </div>

  <!-- Notes display section -->
  <div class="p-4 col-span-2">
    <div class="grid md:grid-flow-* md:grid-cols-3 xl:grid-cols-4 gap-8">
      {#each notes as note (note.id)}
        <div
          class={"border p-4 rounded-lg mb-4 shadow-lg transition-transform duration-300 transform hover:scale-105 " +
            getRandomBgColor()}
          draggable="true"
        >
          <h3 class="font-bold text-lg text-blue-700 mb-2">{note.title}</h3>
          <p class="my-2">{note.note}</p>
          <p class="text-xs text-gray-500">{note.timestamp}</p>
          <div class="flex justify-between mt-2">
            <button
              on:click={() => confirmDelete(note)}
              class="focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="14"
                width="12.25"
                viewBox="0 0 448 512"
                ><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path
                  fill="#ff0000"
                  d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                /></svg
              >
            </button>
            <button on:click={() => editNote(note)} class="focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="14"
                width="12.25"
                viewBox="0 0 512 512"
                ><path
                  fill="#000000"
                  d="M290.74 93.24l-254 254a32 32 0 00-8.48 13.94L1.2 494.8c-6.53 20.6 14.21 41.34 34.81 34.81l133.38-26.08a32 32 0 0013.94-8.48l254-254a64 64 0 00-90.51-90.51l-55.48 55.48a12 12 0 01-17 0l-18.74-18.74a12 12 0 010-17l55.48-55.48a64 64 0 00-90.51-90.51zm170.13 37.6L393.37 36.74a64 64 0 00-90.51 0l-55.48 55.48a12 12 0 010 17l18.74 18.74a12 12 0 0117 0l55.48-55.48a32 32 0 0145.26 45.26L327.52 170.6a12 12 0 010 17l18.74 18.74a12 12 0 0117 0l55.48-55.48a64 64 0 000-90.52z"
                ></path></svg
              >
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Modal for confirmation -->
  {#if showModal}
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded shadow-lg text-center">
        <h2 class="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p class="mb-4">Are you sure you want to delete this note?</p>
        <button
          on:click={confirmDeleteNote}
          class="bg-red-500 text-white px-4 py-2 rounded mr-2">Delete</button
        >
        <button on:click={closeModal} class="bg-gray-300 px-4 py-2 rounded"
          >Cancel</button
        >
      </div>
    </div>
  {/if}
</main>

<style>
  button svg {
    transition: transform 0.3s;
  }

  button:hover svg {
    transform: rotate(20deg);
  }

  .draggable {
    cursor: grab;
  }

  .draggable:active {
    cursor: grabbing;
  }
</style>
