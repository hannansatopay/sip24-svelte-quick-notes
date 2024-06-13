<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  // Array to store multiple notes
  let notes = writable([]);

  let title = 'New Note';
  let note = 'Today is an excellent day!';

  onMount(() => {
      // Load saved notes from localStorage
      const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.set(savedNotes);
  });

  function saveNote() {
      // Save current note to notes array
      notes.update(existingNotes => [...existingNotes, { title, note }]);
      // Update localStorage with new notes array
      localStorage.setItem('notes', JSON.stringify($notes));
      // Reset title and note for next entry
      title = 'New Note';
      note = '';
  }

  function deleteNote(index) {
      notes.update(existingNotes => {
          const updatedNotes = existingNotes.filter((_, i) => i !== index);
          localStorage.setItem('notes', JSON.stringify(updatedNotes));
          return updatedNotes;
      });
  }

  function createNewPage() {
      title = 'New Note';
      note = '';
  }
</script>

<main class="flex">
  <aside class="w-1/4 bg-gray-200 p-4">
      <button 
          class="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium mb-4"
          on:click={createNewPage}
      >
          New Page
      </button>
      <!-- Display saved notes -->
      <ul>
          {#each $notes as { title, note }, index}
              <li class="mb-2">
                  <button 
                      class="bg-gray-400 text-gray-800 px-2 py-1 rounded-md"
                      on:click={() => deleteNote(index)}
                  >
                      Delete
                  </button>
                  <strong>{title}</strong>: {note}
              </li>
          {/each}
      </ul>
  </aside>
  <div class="w-3/4 p-4">
      <input 
          class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-lg p-2 mb-3" 
          type="text" 
          bind:value={title} 
          placeholder="Title" 
      />
      <textarea 
          class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-lg p-2 mb-3" 
          rows="10" 
          bind:value={note} 
          placeholder="Write your note here..."
      ></textarea>
      <button 
          class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium" 
          on:click={saveNote}
      >
          Save Note
      </button>
  </div>
</main>

<style>
  main {
      max-width: 800px;
      margin: 0 auto;
  }
  aside {
      min-width: 200px;
  }
  input, textarea {
      display: block;
      width: 100%;
      margin-bottom: 1rem;
      padding: 0.5rem;
      font-size: 1rem;
  }
  button {
      display: inline-block;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      background-color: #333;
      color: #fff;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
  }
  button:hover {
      background-color: #555;
  }
  ul {
      list-style-type: none;
      padding: 0;
  }
  li {
      margin-bottom: 0.5rem;
  }
</style>
