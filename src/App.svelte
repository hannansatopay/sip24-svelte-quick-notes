<script>
  import { onMount } from 'svelte';
  
  let newTitle = '';
  let newDescription = '';
  let notes = [];

  const addNote = () => {
    if (newTitle.trim() && newDescription.trim()) {
      notes = [...notes, { title: newTitle, description: newDescription }];
      newTitle = '';
      newDescription = '';
      saveNotes();
    }
  };

  const deleteNote = (index) => {
    notes = notes.filter((_, i) => i !== index);
    saveNotes();
  };

  const saveNotes = () => {
    localStorage.setItem('notes', JSON.stringify(notes));
  };

  const loadNotes = () => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      notes = JSON.parse(savedNotes);
    }
  };

  onMount(loadNotes);
</script>

<main class="container mx-auto p-4 bg-gradient-to-r from-green-400 to-blue-500 min-h-screen">
  <div class="bg-white p-8 rounded-lg shadow-lg">
    <h1 class="text-3xl font-bold mb-4 text-center text-gray-700">Notes App</h1>
    <div class="mb-4">
      <input
        type="text"
        bind:value={newTitle}
        placeholder="Enter title"
        class="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <textarea
        bind:value={newDescription}
        placeholder="Enter description"
        class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      ></textarea>
      <button
        on:click={addNote}
        class="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Add Note
      </button>
    </div>
    <ul>
      {#each notes as { title, description }, index}
        <li class="flex justify-between items-center bg-gray-100 p-4 mb-2 rounded-md shadow-md">
          <div class="flex-1">
            <h2 class="font-semibold text-lg text-gray-800">{title}</h2>
            <p class="text-gray-600">{description}</p>
          </div>
          <button
            on:click={() => deleteNote(index)}
            class="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 transition duration-300 ml-4"
          >
            Delete
          </button>
        </li>
      {/each}
    </ul>
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
