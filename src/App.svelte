<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  // Store to manage multiple notes
  let notes = writable([]);

  let title = 'New Note';
  let note = 'Today is an excellent day!';

  // Load notes from localStorage on component mount
  onMount(() => {
      const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
      notes.set(savedNotes);
  });

  // Save current note or update existing note
  function saveNote() {
      // Check if title already exists in notes array
      const existingNoteIndex = $notes.findIndex(n => n.title === title);

      if (existingNoteIndex !== -1) {
          // Update existing note
          notes.update(existingNotes => {
              existingNotes[existingNoteIndex].note = note;
              localStorage.setItem('notes', JSON.stringify(existingNotes));
              return existingNotes;
          });
      } else {
          // Save new note
          notes.update(existingNotes => {
              const updatedNotes = [...existingNotes, { title, note }];
              localStorage.setItem('notes', JSON.stringify(updatedNotes));
              return updatedNotes;
          });
      }

      // Reset title and note for next entry
      title = 'New Note';
      note = '';
  }

  // Delete note at specific index
  function deleteNote(index) {
      notes.update(existingNotes => {
          const updatedNotes = existingNotes.filter((_, i) => i !== index);
          localStorage.setItem('notes', JSON.stringify(updatedNotes));
          return updatedNotes;
      });
  }

  // Edit note by setting title and note values
  function editNote({ title, note }) {
      title = title;
      note = note;
  }

  // Clear current note fields
  function clearNote() {
      title = 'New Note';
      note = '';
  }
</script>

<main class="flex">
  <!-- Sidebar with saved notes -->
  <aside class="w-1/4 bg-gray-200 p-4">
      <button 
          class="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium mb-4"
          on:click={clearNote}
      >
          New Page
      </button>
      <ul>
          <!-- Display saved notes with delete and edit options -->
          {#each $notes as { title, note }, index}
              <li class="mb-2">
                  <button 
                      class="bg-gray-400 text-gray-800 px-2 py-1 rounded-md mr-2"
                      on:click={() => editNote({ title, note })}
                  >
                      Edit
                  </button>
                  <button 
                      class="bg-red-500 text-white px-2 py-1 rounded-md"
                      on:click={() => deleteNote(index)}
                  >
                      Delete
                  </button>
                  <strong>{title}</strong>: {note}
              </li>
          {/each}
      </ul>
  </aside>
  <!-- Main content area for editing and saving notes -->
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
          class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium mr-2"
          on:click={saveNote}
      >
          Save Note
      </button>
      <button 
          class="bg-gray-500 text-white px-5 py-2.5 rounded-lg font-medium"
          on:click={clearNote}
      >
          Clear
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
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
  }
  .bg-gray-800 {
      background-color: #333;
  }
  .bg-gray-800:hover {
      background-color: #555;
  }
  .bg-gray-500 {
      background-color: #888;
  }
  .bg-gray-500:hover {
      background-color: #666;
  }
  .bg-red-500 {
      background-color: #e53e3e;
  }
  .bg-red-500:hover {
      background-color: #c53030;
  }
  ul {
      list-style-type: none;
      padding: 0;
  }
  li {
      margin-bottom: 0.5rem;
  }
</style>
