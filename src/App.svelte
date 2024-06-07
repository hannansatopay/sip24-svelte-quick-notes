<script>
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  // Initialize the Dexie database
  const db = new Dexie('notesDatabase');
  db.version(1).stores({
    pages: '++id, title, note'
  });

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  // Load notes from IndexedDB on component mount
  onMount(async () => {
    const savedPages = await db.pages.toArray();
    if (savedPages.length) {
      pages = savedPages;
      selectPage(0);
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const currentPage = pages[currentPageIndex];
    if (currentPage.title !== title) {
      // Update title in IndexedDB
      await db.pages.update(currentPage.id, { title });
      currentPage.title = title;
    }
    await db.pages.update(currentPage.id, { note });
    pages[currentPageIndex].note = note;
  }

  async function addPage() {
    const newPage = { title: 'New Page', note: '' };
    const id = await db.pages.add(newPage);
    newPage.id = id;
    pages.push(newPage);
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].note;
  }

  async function deletePage(index) {
    const pageToDelete = pages[index];
    await db.pages.delete(pageToDelete.id);
    pages.splice(index, 1);
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(Math.min(currentPageIndex, pages.length - 1));
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex justify-between items-center">
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-purple-600 text-white' : 'bg-white text-gray-900'} py-2 px-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105">{page.title}</button>
        <button on:click={() => deletePage(index)} class="ml-2 text-red-700 hover:text-red-900 transition-all duration-300 ease-in-out transform hover:scale-105">Delete</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium text-white bg-green-500 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold text-blue-600 bg-blue-100 rounded-lg px-2 py-1 contenteditable" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-green-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-green-600" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-yellow-50 border border-yellow-300 rounded-lg text-gray-900 p-2.5 resize-none h-80 focus:ring-2 focus:ring-yellow-400" bind:value={note}></textarea>
</main>

<style>
  .bg-gradient-to-r {
    background: linear-gradient(to right, #7f00ff, #e100ff);
  }
  .bg-purple-600 {
    background-color: #6b21a8;
  }
  .bg-blue-100 {
    background-color: #ebf8ff;
  }
  .bg-green-500 {
    background-color: #48bb78;
  }
  .bg-yellow-50 {
    background-color: #fffbee;
  }
</style>
