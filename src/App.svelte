<script>
  import { onMount } from 'svelte';
  import { saveNoteToDB, getNoteFromDB, deleteNoteFromDB } from './db';

  let notes = [];
  let title = '';
  let note = '';

  onMount(async () => {
    notes = await getNoteFromDB();
  });

  async function saveNote() {
    const newNote = { title, note };
    await saveNoteToDB(newNote);
    notes = await getNoteFromDB();
    title = '';
    note = '';
  }

  async function deleteNote(id) {
    await deleteNoteFromDB(id);
    notes = await getNoteFromDB();
  }
</script>

<main class="p-4">
  <input
    class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={title}
    type="text"
    placeholder="Add Title"
  >
  <textarea
    class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={note}
    placeholder="Add Note"
  ></textarea>
  <button
    class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900"
    on:click={saveNote}
  >
    Save
  </button>

  <div class="notes mt-5">
    {#each notes as { id, title, note }}
      <div class="note border border-gray-300 rounded-lg p-3 mb-3">
        <h3 class="text-lg font-bold">{title}</h3>
        <p>{note}</p>
        <button
          class="bg-red-600 text-white px-3 py-1 rounded-lg font-medium text-sm mt-3 hover:bg-red-700"
          on:click={() => deleteNote(id)}
        >
          Delete
        </button>
      </div>
    {/each}
  </div>
</main>

<style>
</style>
