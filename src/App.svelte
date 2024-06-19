<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';
 
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let db;
 
  onMount(async () => {
    db = await openDB('notes-db', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
      },
    });
    
    const savedPages = (await db.get('notes', 'pages'))?.value;
    if (savedPages) {
      pages = savedPages;
      title = pages[currentPageIndex];
      note = (await db.get('notes', title))?.value || '';
    } else {
      addPage();
    }
  });
 
  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex] = title;
    }
 
    await db.put('notes', { title, value: note });
    await db.put('notes', { title: 'pages', value: pages });
  }
 
  async function addPage() {
    pages.push('New Page');
    await db.put('notes', { title: 'pages', value: pages });
    selectPage(pages.length - 1);
  }
 
  async function deletePage(index) {
    const pageTitle = pages[index];
    pages.splice(index, 1);
    await db.delete('notes', pageTitle);
    await db.put('notes', { title: 'pages', value: pages });
 
    if (index === currentPageIndex) {
      currentPageIndex = pages.length ? Math.min(index, pages.length - 1) : 0;
      title = pages[currentPageIndex] || '';
      note = (await db.get('notes', title))?.value || '';
    }
  }
 
  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = (await db.get('notes', title))?.value || '';
  }
 </script>
 
 <aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">
            {page}
          </button>
          <button on:click={() => deletePage(index)} class="text-red-500 ml-2">X</button>
        </li>
      {/each}
      <li class="text-center">
        <button class="font-medium" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
 </aside>
 
 <main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 mt-3 rounded-lg font-medium text-sm hover:bg-gray-900" on:click={saveNote}>
      Save
    </button>
  </div>
  <hr />
  <textarea class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5 mt-3" bind:value={note}></textarea>
 </main>
 
 <style>
  .bg-light-gray {
    background: #FBFBFB;
  }
  .bg-dark-gray {
    background: #EFEFEF;
  }
 </style>