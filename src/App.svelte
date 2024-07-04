<script>
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  // Define the Dexie database
  const db = new Dexie('HandyNotes');
  db.version(1).stores({
    pages: '++id,title',
    notes: 'title,note'
  });

  let pages = [];
  let currentPageIndex = 0;
  let title = ''; 
  let note = '';
  let searchQuery = '';
  let filteredPages = [];

  onMount(async () => {
    await loadPages();
    if (pages.length > 0) {
      await selectPage(0);
    } else {
      await addPage();
    }
    filteredPages = pages;
  });

  // Load all pages
  async function loadPages() {
    pages = await db.table('pages').toArray();
  }

  // Save the note
  async function saveNote() {
    const currentPage = pages[currentPageIndex];
    if (currentPage.title !== title) {
      await db.table('notes').delete(currentPage.title);
      currentPage.title = title;
      await db.table('pages').put(currentPage);
    }
    await db.table('notes').put({ title, note });
    await loadPages();
    filteredPages = pages;
  }

  // Add a new page
  async function addPage() {
    const newPage = { title: 'New Page' };
    await db.table('pages').add(newPage);
    await loadPages();
    await selectPage(pages.length - 1);
  }

  // Select a page
  async function selectPage(index) {
    currentPageIndex = index;
    const currentPage = pages[currentPageIndex];
    title = currentPage.title;
    const noteData = await db.table('notes').get(title);
    note = noteData ? noteData.note : '';
  }

  // Delete a page
  async function deletePage(index) {
    const pageToDelete = pages[index];
    await db.table('pages').delete(pageToDelete.id);
    await db.table('notes').delete(pageToDelete.title);
    await loadPages();
    if (pages.length === 0) {
      await addPage();
    } else {
      await selectPage(index > 0 ? index - 1 : 0);
    }
    filteredPages = pages;
  }

  // Search pages
  function searchPages() {
    filteredPages = pages.filter(page => page.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  function selectPageFromDropdown(page) {
    const index = pages.findIndex(p => p.title === page.title);
    if (index !== -1) {
      selectPage(index);
      searchQuery = '';
      filteredPages = pages;
    }
  }
</script>

<header class="p-4 bg-gray-200 border-b border-blue-300 relative">
  <h1 class="text-3xl font-bold inline-block">HandyNotes</h1>
  <div class="inline-block relative ml-12 w-1/2">
    <input 
      type="text" 
      placeholder="Search ..." 
      bind:value={searchQuery} 
      on:input={searchPages} 
      class="w-full py-2 px-3 border border-blue-300 rounded-lg"/>
    {#if searchQuery !== ''}
      <ul class="dropdown-menu absolute left-0 right-0 bg-white border border-gray-300 mt-1 z-10 max-h-60 overflow-y-auto">
        {#each filteredPages as page}
          <li>
            <button type="button" class="dropdown-item w-full text-left px-4 py-2 cursor-pointer hover:bg-blue-100" on:click={() => selectPageFromDropdown(page)}>
              {page.title}
            </button>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</header>

<aside class="fixed top-4 left-0 z-40 w-60 h-screen mt-16">
  <div class="bg-light-blue overflow-y-auto py-5 px-3 h-full border-r border-blue-200">
    <ul class="space-y-2">
      {#each filteredPages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-blue' : ''} py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
          <button on:click={() => deletePage(index)} class="ml-2 text-red-500">❌</button>
        </li>
      {/each}     
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-blue-900" on:click={saveNote}>Save</button>
  </div>
  <hr/>  
  <textarea class="mt-3 block w-full bg-gray-50 border border-blue-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-blue {
    background: #B3C8ED;
  }

  .bg-dark-blue {
    background: #3E7FF1;
  }

  .dropdown-menu {
    max-height: 200px;
    overflow-y: auto;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  }

  .dropdown-item {
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  .dropdown-item:hover {
    background: #f8f9fa;
  }
</style>