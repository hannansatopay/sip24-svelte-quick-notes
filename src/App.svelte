<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';
//indexeddb
  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  async function initDB() {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
        db.createObjectStore('pages', { keyPath: 'index' });
      },
    });
  }

  async function loadPages() {
    const allPages = await db.getAll('pages');
    pages = allPages.map(page => page.title);
  }

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex] = title;
      await db.put('pages', { index: currentPageIndex, title });
    }
    await db.put('notes', { title, note });
  }

  async function addPage() {
    const newPageTitle = 'New Page';
    pages = [...pages, newPageTitle];
    currentPageIndex = pages.length - 1;
    title = newPageTitle;
    note = '';
    await db.put('pages', { index: currentPageIndex, title });
  }

  async function delPage() {
    if (pages.length > 0) {
      const pageToDelete = pages[currentPageIndex];
      pages = pages.filter((_, index) => index !== currentPageIndex);
      await db.delete('notes', pageToDelete);
      await db.delete('pages', currentPageIndex);

      pages.forEach(async (page, index) => {
        await db.put('pages', { index, title: page });
      });

      if (pages.length > 0) {
        currentPageIndex = currentPageIndex > 0 ? currentPageIndex - 1 : 0;
        selectPage(currentPageIndex);
      } else {
        await addPage();
      }
    }
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const noteData = await db.get('notes', title);
    note = noteData ? noteData.note : '';
  }

  onMount(async () => {
    await initDB();
    await loadPages();
    if (pages.length > 0) {
      selectPage(currentPageIndex);
    } else {
      await addPage();
    }
  });
</script>

<aside class="fixed top-0 left-0 z-40 w-64 h-screen bg-gray-800 text-white">
  <div class="overflow-y-auto py-5 px-3 h-full border-r border-gray-700">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-gray-700' : 'bg-gray-800'} py-2 px-3 text-white rounded-lg w-full text-left hover:bg-gray-700 transition duration-150 ease-in-out">{page}</button>
      </li>
      {/each}
      <li class="text-center mt-4"><button on:click={addPage} class="font-medium bg-gray-600 py-2 px-3 rounded-lg hover:bg-gray-500 transition duration-150 ease-in-out">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-8 ml-64 h-auto bg-gray-100 min-h-screen">
  <div class="grid grid-cols-3 items-center mb-6">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-blue-700 transition duration-150 ease-in-out" on:click={saveNote}>Save</button>
    <button class="ml-auto bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700 transition duration-150 ease-in-out" on:click={delPage}>Delete</button>
  </div>
  <hr class="border-gray-300"/>
  <textarea class="mt-4 block w-full bg-white border border-gray-300 rounded-lg text-gray-900 p-3 shadow-sm focus:ring focus:ring-blue-200 transition duration-150 ease-in-out" bind:value={note}></textarea>
</main>

<style>


</style>

 
