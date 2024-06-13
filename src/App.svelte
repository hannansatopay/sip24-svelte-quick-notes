<script>
  import { onMount } from 'svelte';
  import { saveNoteToDB, loadNoteFromDB, deleteNoteFromDB, savePagesToDB, loadPagesFromDB } from './db.js';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    pages = await loadPagesFromDB();
    if (pages.length > 0) {
      title = pages[currentPageIndex];
      note = await loadNoteFromDB(title);
    } else {
      addPage();
    }
  });

  async function saveNote() {

    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await deleteNoteFromDB(storedPageName);
      pages[currentPageIndex] = title;
    }
    await saveNoteToDB(title, note);
    await savePagesToDB(pages);
  }

  function addPage() {
    const newPageTitle = "New Page";
    pages = [...pages, newPageTitle];
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = await loadNoteFromDB(title);
  }

  async function deleteNote() {
    const pageToDelete = pages[currentPageIndex];
    await deleteNoteFromDB(pageToDelete);
    
    pages = pages.filter((_, index) => index !== currentPageIndex);

    if (pages.length === 0) {
      addPage();
    } else {
      currentPageIndex = currentPageIndex >= pages.length ? pages.length - 1 : currentPageIndex;
      title = pages[currentPageIndex];
      note = await loadNoteFromDB(title);
    }

    await savePagesToDB(pages);
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">
            {page}
          </button>
        </li>
      {/each}     
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex space-x-4">
      <button class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-4 hover:bg-red-700" on:click={deleteNote}>Delete</button>
      <button class="bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-4 hover:bg-blue-800" on:click={saveNote}>Save</button>
    </div>
  </div>
  <hr />
  <textarea class="mt-4 block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5 hover:bg-gray-100" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }

  .bg-dark-gray {
    background: #89b3fb;
  }
</style>
