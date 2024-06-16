<script>
  import { onMount } from 'svelte';
  // @ts-ignore
  import { faEdit, faTrashAlt, faTimes, faPlus, faNoteSticky } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

  let title = '';
  let content = '';
  let notes = [];
  let activeNoteId = null;
  let isEditing = false;

  // Load notes from local storage on component mount
  onMount(() => {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      notes = JSON.parse(storedNotes);
    }
  });

  function handleSubmit(event) {
    event.preventDefault();
    if (title && content) {
      if (activeNoteId) {
        // Edit existing note
        notes = notes.map(note =>
          note.id === activeNoteId ? { ...note, title, content } : note
        );
      } else {
        // Create new note
        const newNote = { title, content, id: Date.now() };
        notes = [newNote, ...notes];
      }
      localStorage.setItem('notes', JSON.stringify(notes));
      resetForm();
      alert('Note saved successfully!');
    } else {
      alert('Please fill out all fields.');
    }
  }

  function handleNoteClick(note) {
    activeNoteId = note.id;
    title = note.title;
    content = note.content;
    isEditing = false;
  }

  function handleEdit() {
    isEditing = true;
  }

  function handleDelete() {
    if (activeNoteId) {
      notes = notes.filter(note => note.id !== activeNoteId);
      localStorage.setItem('notes', JSON.stringify(notes));
      resetForm();
      alert('Note deleted successfully!');
    }
  }

  function handleCancel() {
    resetForm();
  }

  function resetForm() {
    activeNoteId = null;
    title = '';
    content = '';
    isEditing = false;
  }
</script>

<main class="w-screen h-screen flex">
  <aside class="bg-gradient-to-b from-blue-700 to-blue-500 w-3/12 h-screen p-4">
    <h2 class="text-white font-sans text-2xl text-center font-bold mb-4">Notes App</h2>
    <nav>
      <ul class="text-white">
        <li class="mb-4 text-center">
          <button 
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
            on:click={resetForm}>
            <FontAwesomeIcon icon={faPlus} /> Add Note
          </button>
        </li>
      </ul>
      <ul class="text-white pl-2 font-sans text-">
        {#each notes as note (note.id)}
          <li class="mb-2 font-bold">
            <button class="hover:bg-blue-800 p-2 rounded-md block transition duration-300 w-full text-left" on:click={() => handleNoteClick(note)}>
              <FontAwesomeIcon icon={faNoteSticky} class="mr-2" /> {note.title}
            </button>
          </li>
        {/each}
      </ul>
    </nav>
  </aside>
  <section class="w-9/12 h-screen p-6 bg-gray-100">
    <div class="flex justify-center items-center h-full">
      <div class="w-8/12 bg-white p-6 rounded-lg shadow-lg">
        {#if activeNoteId && !isEditing}
          <div>
            <h2 class="text-2xl font-bold mb-4">{title}</h2>
            <p class="mb-4">{content}</p>
            <button class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition duration-300 mr-2" on:click={handleEdit}>
              <FontAwesomeIcon icon={faEdit} /> Edit
            </button>
            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 mr-2" on:click={handleDelete}>
              <FontAwesomeIcon icon={faTrashAlt} /> Delete
            </button>
            <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300" on:click={handleCancel}>
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </button>
          </div>
        {:else}
          <form on:submit={handleSubmit} id="note-form">
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" id="title" bind:value={title} class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            </div>
            <div class="mb-4">
              <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
              <textarea id="content" bind:value={content} rows="3" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"></textarea>
            </div>
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 mr-2">
              {activeNoteId ? 'Save' : 'Create'}
            </button>
            {#if activeNoteId}
              <button type="button" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300" on:click={handleCancel}>
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            {/if}
          </form>
        {/if}
      </div>
    </div>
    <footer>
      <p class="text-center text-gray-500">Made with ❤️ by <a href="https://github.com/YashMehetre" class="text-blue-500">Yash Mehetre</a></p>
    </footer>
  </section>
</main>

<style>
  
</style>
