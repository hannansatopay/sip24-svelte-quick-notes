<script>
  import { onMount } from 'svelte';

  let title = 'New Note';
  let note = 'Today is an excellent day!';

  // Load saved title and note from localStorage when the component mounts
  onMount(() => {
    const savedTitle = localStorage.getItem('title');
    const savedNote = localStorage.getItem('note');
    
    if (savedTitle) title = savedTitle;
    if (savedNote) note = savedNote;
  });

  // Save title and note to localStorage
  function saveNote() {
    console.log('Saving note...'); // Debugging statement
    console.log('Title:', title);
    console.log('Note:', note);

    localStorage.setItem('title', title);
    localStorage.setItem('note', note);

    console.log('Note saved!'); // Confirm saving
  }
</script>

<main class="p-8">
  <input 
    class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-lg p-2" 
    bind:value={title} 
    placeholder="Note Title"
  />
  <textarea 
    class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-lg p-2" 
    bind:value={note} 
    placeholder="Your note here..."
  ></textarea>
  <button 
    class="mt-3 bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-lg" 
    on:click={saveNote}
  >
    Save
  </button>
</main>

<style>
  /* Add your styles here if necessary */
</style>
