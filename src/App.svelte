<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  const dbPromise = openDB('notes-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('pages')) {
        const store = db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
        store.createIndex('title', 'title', { unique: true });
      }
    },
  });

  onMount(async () => {
    const db = await dbPromise;
    const allPages = await db.getAll('pages');
    if (allPages.length) {
      pages = allPages;
      selectPage(0);
    } else {
      await addPage();
    }
  });

  async function saveNote() {
    const db = await dbPromise;
    const page = pages[currentPageIndex];
    page.title = title;
    await db.put('pages', page);
    const allPages = await db.getAll('pages');
    pages = allPages;
  }

  async function addPage() {
    const db = await dbPromise;
    const newPage = { title: "New Page" };
    const id = await db.add('pages', newPage);
    newPage.id = id;
    pages.push(newPage);
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    const page = pages[currentPageIndex];
    title = page.title;
    const db = await dbPromise;
    const noteObj = await db.get('pages', page.id); // Corrected to use 'pages' object store
    note = noteObj ? noteObj.note : "";
  }

  async function deletePage() {
    if (confirm("Are you sure you want to delete this page?")) {
      const db = await dbPromise;
      const page = pages[currentPageIndex];
      await db.delete('pages', page.id);
      pages.splice(currentPageIndex, 1);
      if (currentPageIndex >= pages.length) {
        selectPage(pages.length - 1);
      }
    }
  }
</script>

<aside class="fixed top-0 left-0 z-0 w-60 h-screen">
  <div class="bg-black overflow-y-auto py-5 px-3 h-full border-r border-white ">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-gray-700' : ''} py-2 px-3 text-white rounded-lg">{page.title}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium text-white bg-red-600 w-10 h-10 text-2xl rounded-full">+</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="flex justify-end">
      <button on:click={saveNote} class=" bg-gray-800 text-white px-5 py-2.5 rounded-3xl font-medium text-sm mt-3 hover:bg-gray-900">Save</button>
      <button on:click={deletePage} class="ml-5 bg-gray-800 text-white px-5 py-2.5 rounded-3xl font-medium text-sm mt-3 hover:bg-gray-900">Delete</button>
    </div>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  
</style>
