<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let content = '';

  async function initDB() {
    db = await openDB('notes-app', 1, {
      upgrade(db) {
        db.createObjectStore('notes');
        db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
      },
    });
  }

  async function getPagesFromDB() {
    const storedPages = await db.getAll('pages');
    return storedPages.map(page => page.title);
  }

  async function updatePagesInDB() {
    await db.clear('pages');
    for (let i = 0; i < pages.length; i++) {
      await db.put('pages', { id: i + 1, title: pages[i] });
    }
  }

  onMount(async () => {
    await initDB();
    pages = await getPagesFromDB();
    if (pages.length > 0) {
      currentPageIndex = 0;
      selectPage(currentPageIndex);
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      const pageIndex = pages.indexOf(storedPageName);
      if (pageIndex > -1) {
        const page = await db.get('pages', pageIndex + 1);
        await db.delete('notes', page.title);
        pages[currentPageIndex] = title;
        await db.put('pages', { id: page.id, title });
      }
    }
    await db.put('notes', content, title);
    await updatePagesInDB();
  }

  async function addPage() {
    const newPageTitle = "New Page";
    pages.push(newPageTitle);
    currentPageIndex = pages.length - 1;
    await db.put('pages', { id: currentPageIndex + 1, title: newPageTitle });
    selectPage(currentPageIndex);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    content = await db.get('notes', title) || '';
  }

  async function deletePage(index) {
    const pageToDelete = pages[index];
    await db.delete('notes', pageToDelete);
    pages.splice(index, 1);
    await updatePagesInDB();
    pages = await getPagesFromDB();
    if (pages.length === 0) {
      addPage();
    } else {
      currentPageIndex = index >= pages.length ? pages.length - 1 : index;
      selectPage(currentPageIndex);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <h2 class="text-xl font-bold mb-4">Notes</h2>
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex justify-between items-center">
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        <button on:click={() => deletePage(index)} class="text-red-500 ml-2">Delete</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title} spellcheck="false"></h1>
    <button class="ml-auto bg-gray-800 text-white px-2.5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr>
  <textarea class="mt-3 w-full h-80 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={content} spellcheck="false"></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }

  aside h2 {
    color: #4A4A4A;
    text-align: center;
  }

  button {
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #E0E0E0;
  }
</style>
