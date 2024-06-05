<script>
  import { onMount } from 'svelte';
  import { getAllNotes, addNote, updateNote, deleteNoteById } from './store';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let currentNoteId = null;

  onMount(async () => {
    console.log('Mounting component...');
    await loadNotes();
  });

  async function loadNotes() {
    console.log('Loading notes...');
    const savedPages = await getAllNotes();
    if (savedPages.length) {
      pages = savedPages;
      currentPageIndex = 0;
      selectPage(currentPageIndex);
    } else {
      await addNewPage();
    }
  }

  async function saveNote() {
    console.log('Saving note:', { currentNoteId, title, note });
    if (currentNoteId !== null) {
      await updateNote(currentNoteId, title, note);
      pages = await getAllNotes();
    }
  }

  async function addNewPage() {
    console.log('Adding new page');
    const id = await addNote('New Page', '');
    pages = await getAllNotes();
    currentPageIndex = pages.length - 1;
    selectPage(currentPageIndex);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    const selectedPage = pages[currentPageIndex];
    title = selectedPage.title;
    note = selectedPage.note;
    currentNoteId = selectedPage.id;
    console.log('Selected page:', selectedPage);
  }

  async function deletePage(index) {
    const idToDelete = pages[index].id;
    console.log('Deleting page:', idToDelete);
    await deleteNoteById(idToDelete);
    pages = await getAllNotes();

    if (pages.length === 0) {
      await addNewPage();
    } else {
      currentPageIndex = index === 0 ? 0 : index - 1;
      selectPage(currentPageIndex);
    }
  }
</script>

<<<<<<< HEAD
<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex items-center">
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} flex-grow py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
          <button on:click={() => deletePage(index)} class="ml-2 text-red-500 rounded-full hover:bg-red-200 transition-colors duration-200  text-lg w-10 h-10 font-semibold ">X</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addNewPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>


<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto text-white bg-blue-700 hover:bg-blue-800 rounded-full text-lg w-10 h-10" on:click={saveNote}>+</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
=======
<main>
  Hello World!
>>>>>>> 5b82e617a6c57e099e24f5691e28c001eeb48680
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }

<<<<<<< HEAD
  .bg-dark-gray {
    background: #EFEFEF;
  }
=======
>>>>>>> 5b82e617a6c57e099e24f5691e28c001eeb48680
</style>
