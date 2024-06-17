<script>
  import { onMount } from 'svelte';
  import { faEdit, faTrashAlt, faTimes, faPlus, faNoteSticky, faBars } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import * as idbService from './utils/idbService'; // Import the new service
  import toast, {Toaster} from 'svelte-french-toast'

  let title = '';
  let content = '';
  let notes = [];
  let activeNoteId = null;
  let isEditing = false;
  let isSidebarOpen = false;

  onMount(async () => {
    await idbService.openDatabase(); // Open the database
    notes = await idbService.getNotes(); // Get notes from IndexedDB
  });

  function handleSubmit(event) {
    event.preventDefault();
    if (title && content) {
      const note = { title, content, id: Date.now() };
      if (activeNoteId) {
        note.id = activeNoteId;
        idbService.updateNote(note); // Update note in IndexedDB
      } else {
        idbService.addNote(note); // Add note to IndexedDB
      }
      idbService.getNotes().then(updatedNotes => {
        notes = updatedNotes; // Get updated notes from IndexedDB
        resetForm();
        //alert('Note saved successfully!');
        toast.success('Note saved successfully!')
      });
    } else {
      //alert('Please fill out all fields.');
      toast.error('Please fill out all fields.')
    }
  }

  function handleNoteClick(note) {
    activeNoteId = note.id;
    title = note.title;
    content = note.content;
    isEditing = false;
    if (isSidebarOpen) toggleSidebar(); // Close sidebar on small screens
  }

  function handleEdit() {
    isEditing = true;
  }

  function handleDelete() {
    if (activeNoteId) {
      idbService.deleteNote(activeNoteId); // Delete note from IndexedDB
      idbService.getNotes().then(updatedNotes => {
        notes = updatedNotes; // Get updated notes from IndexedDB
        resetForm();
        //alert('Note deleted successfully!');
        toast.success('Note deleted successfully!')
      });
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

  function toggleSidebar() {
    isSidebarOpen = !isSidebarOpen;
  }
</script>
<Toaster />
<main class="w-screen h-screen flex bg-gray-100">
  <!-- Sidebar -->
  <aside class={`bg-white shadow-lg w-72 h-screen p-4 fixed left-0 top-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
    <h2 class="text-blue-700 font-sans text-2xl text-center font-bold mb-4">Notes App</h2>
    <nav>
      <ul>
        <li class="mb-4 text-center">
          <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300" on:click={resetForm}>
            <FontAwesomeIcon icon={faPlus} /> Add Note
          </button>
        </li>
      </ul>
      <ul class="pl-2 font-sans text-">
        {#each notes as note (note.id)}
          <li class="mb-2 font-bold">
            <button class="hover:bg-blue-100 p-2 rounded-md block transition duration-300 w-full text-left" on:click={() => handleNoteClick(note)}>
              <FontAwesomeIcon icon={faNoteSticky} class="mr-2 text-blue-700" /> {note.title}
            </button>
          </li>
        {/each}
      </ul>
    </nav>
    <button class="md:hidden absolute top-4 right-4 text-gray-700" on:click={toggleSidebar}>
      <FontAwesomeIcon icon={faTimes} />
    </button>
  </aside>

  <!-- Main content -->
  <section class="w-full h-screen p-6">
    <button class="md:hidden absolute top-4 left-4 text-gray-700" on:click={toggleSidebar}>
      <FontAwesomeIcon icon={faBars} />
    </button>
    <div class="flex justify-center items-center h-full">
      <div class="w-full md:w-6/12 bg-white p-6 rounded-lg shadow-lg">
        {#if activeNoteId && !isEditing}
          <div>
            <h2 class="text-2xl font-bold mb-4 text-blue-700">{title}</h2>
            <p class="mb-4">{content}</p>
            <button class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300 mr-2" on:click={handleEdit}>
              <FontAwesomeIcon icon={faEdit} /> <p class='hidden md:inline-block'>Edit</p>
            </button>
            <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 mr-2" on:click={handleDelete}>
              <FontAwesomeIcon icon={faTrashAlt} /> <p class='hidden md:inline-block'>Delete</p>
            </button>
            <button class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300" on:click={handleCancel}>
              <FontAwesomeIcon icon={faTimes} /> <p class='hidden md:inline-block'>Cancel</p>
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
            <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 mr-2">
              {activeNoteId ? 'Save' : 'Create'}
            </button>
            {#if activeNoteId}
              <button type="button" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300" on:click={handleCancel}>
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            {/if}
          </form>
        {/if}
      </div>
    </div>
    <footer>
      <p class="text-center text-gray-500">Made with ❤️ by <a href="https://github.com/falcaozane" class="text-blue-500">Zane Falcao</a></p>
    </footer>
  </section>
</main>
