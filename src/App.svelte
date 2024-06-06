<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

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

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={delPage}>Delete</button>
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

 
