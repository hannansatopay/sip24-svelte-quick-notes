<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = 'New Note';
  let note = 'today is an excellent day';
  let db;

  async function initDB() {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
        db.createObjectStore('pages', { keyPath: 'index' });
      },
    });
  }

  async function loadPages() {
    const tx = db.transaction('pages', 'readonly');
    const store = tx.objectStore('pages');
    pages = await store.getAll();
    if (pages.length > 0) {
      title = pages[currentPageIndex].title;
      note = await db.get('notes', title);
    } else {
      addPage();
    }
  }

  onMount(async () => {
    await initDB();
    await loadPages();
  });

  async function saveNote() {
    const storedPage = pages[currentPageIndex];
    if (storedPage.title !== title) {
      await db.delete('notes', storedPage.title);
      pages[currentPageIndex].title = title;
    }
    await db.put('notes', { title, note });
    await db.put('pages', { index: currentPageIndex, title });
  }

  async function addPage() {
    const newPage = { index: pages.length, title: 'New page' };
    pages.push(newPage);
    await db.put('pages', newPage);
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = await db.get('notes', title);
  }

  async function deletePage(index) {
    const deletedPage = pages.splice(index, 1)[0];
    await db.delete('notes', deletedPage.title);
    await db.delete('pages', index);
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(index > 0 ? index - 1 : 0);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex items-center justify-between">
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-frame' : ''} py-2 px-3 flex-1 text-left">{page.title}</button>
          <button on:click={() => deletePage(index)} class="delete-button">Delete Page</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium bg-dark-blue py-2 px-3 text-color-white">+Add page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-green-600 text-white px-5 py-2 rounded-lg font-bold text-sm mt-3 hover:bg-green-900" on:click={saveNote}>Save</button>
  </div>
  <hr />
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: white;
  }
  .bg-dark-frame {
    background: #cac4c4;
  }
  .bg-dark-blue {
    background: #011532;
  }
  .text-color-white {
    color: white;
  }
   .delete-button {
    background-color: rgb(202, 11, 11);
    color: white;
    padding: 0.5rem 1rem;
    border: none; 
    border-radius: 0.25rem; 
    cursor: pointer;
  }
  .delete-button:hover {
    background-color: rgb(86, 0, 0);
  }

  
</style>
