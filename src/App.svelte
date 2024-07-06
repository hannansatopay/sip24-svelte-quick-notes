<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let title = '';
  let note = '';
  let pages = [];
  let currentPageIndex = 0;
  let db;

  // Initialize the database
  async function initDB() {
    db = await openDB('notes-db', 1, {
      upgrade(db) {
        db.createObjectStore('notes');
        db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
      },
    });
  }

  // Load data from IndexedDB
  async function loadData() {
    pages = (await db.getAll('pages')).map(item => item.title);
    if (pages.length) {
      title = pages[currentPageIndex];
      note = await db.get('notes', title);
    } else {
      addPage();
    }
  }

  onMount(async () => {
    await initDB();
    await loadData();
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.delete('notes', storedPageName);
      pages = [...pages];
      pages[currentPageIndex] = title;
    }
    await db.put('notes', note, title);
    await db.put('pages', { id: currentPageIndex, title });
  }

  function addPage() {
    pages = [...pages, 'New Page'];
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = await db.get('notes', title);
  }

  async function deletePage(index) {
    const pageTitle = pages[index];
    await db.delete('notes', pageTitle);
    pages = pages.filter((_, i) => i !== index);
    await db.delete('pages', index);
    if (pages.length > 0) {
      selectPage(index === 0 ? 0 : index - 1);
    } else {
      title = '';
      note = '';
      addPage();
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen bg-light-gray overflow-y-auto py-5 px-3 border-r border-gray-200">
  <ul class="space-y-2">
    {#each pages as page, index}
      <li class="flex justify-between items-center">
        <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">
          {page}
        </button>
        <button on:click={() => deletePage(index)} class="ml-2">Delete</button>
      </li>
    {/each}
    <li class="text-center">
      <button on:click={addPage} class="font-medium">+ Add page</button>
    </li>
  </ul>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-small mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }
  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
