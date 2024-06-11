<script>
 import { onMount } from 'svelte';
 import Dexie from 'dexie';

 let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  
  onMount(async () => {
    db = new Dexie('noteDB');
    db.version(1).stores({
      pages: '++id, title, note',
    });
    await loadPages();
  });

  async function loadPages() {
    // Fetch all pages from the 'pages' store
    pages = await db.pages.toArray();
    // Select the first page or the current page if it exists
    selectPage(pages.length > 0 ? currentPageIndex : 0);
  }

  async function saveNote() {
    if (pages.length > 0) {
      // Get the actual ID of the current page
      const currentPage = pages[currentPageIndex];
      if (currentPage) {
        // Update the current page using its ID
        await db.pages.update(currentPage.id, { title: title, note: note });
        // Reload pages to reflect changes
        await loadPages();
      }
    }
  }

  async function addPage() {
    // Add a new page to the database
    await db.pages.add({ title: 'New Page', note: '' });
    // Reload pages and select the newly added page
    const newIndex = pages.length; // Index of the newly added page
    await loadPages();
    selectPage(newIndex);
  }

  async function selectPage(index) {
    if (pages.length > 0) {
      currentPageIndex = index;
      const page = pages[currentPageIndex];
      if (page) {
        title = page.title;
        note = page.note;
      }
    } else {
      // If no pages exist, reset title and note
      title = '';
      note = '';
    }
  }

  async function deletePage() {
    if (pages.length > 0) {
      // Get the actual ID of the current page
      const currentPage = pages[currentPageIndex];
      if (currentPage) {
        // Delete the current page using its ID
        await db.pages.delete(currentPage.id);
        // Reload pages to reflect changes
        await loadPages();
        // Select the previous page or reset if no pages remain
        selectPage(Math.min(currentPageIndex, pages.length - 1));
      }
    }
  }
  
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex space-x-2">
      <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
      <button class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700" on:click={deletePage}>Delete</button>
    </div>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style> 
  .bg-light-gray {
    background: #FBFBFB;
  }
  .bg-dark-gray {
    background: #efefef;
  }
</style>