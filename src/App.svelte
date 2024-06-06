<script>
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  // Initialize Dexie and define the database schema
  function initDB() {
    db = new Dexie('notesDB');
    db.version(1).stores({
      notes: 'title,note', // Primary key and indexed fields
      pages: '++id,title' // Auto-incremented primary key
    });
    console.log('Dexie initialized:', db);
  }

  onMount(async () => {
    initDB();
    const savedPages = await db.pages.toArray();
    console.log('Saved pages:', savedPages);
    if (savedPages.length > 0) {
      pages = savedPages.map(page => page.title);
      title = pages[currentPageIndex];
      const savedNote = await db.notes.get({ title });
      console.log('Saved note:', savedNote);
      note = savedNote ? savedNote.note : '';
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.notes.delete(storedPageName);
      pages[currentPageIndex] = title;
    }
    await db.notes.put({ title, note });
    await db.pages.put({ id: currentPageIndex + 1, title });
    console.log('Note saved to IndexedDB:', { title, note });
  }

  async function deleteNote() {
    const storedPageName = pages[currentPageIndex];
    await db.notes.delete(storedPageName);
    pages.splice(currentPageIndex, 1);
    console.log('Note deleted from IndexedDB:', storedPageName);

    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
    }

    const allPages = pages.map((title, index) => ({ id: index + 1, title }));
    await db.pages.clear();
    await db.pages.bulkPut(allPages);
    console.log('Pages updated in IndexedDB:', allPages);
  }

  async function addPage() {
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
    await db.pages.put({ id: pages.length, title: "New Page" });
    console.log('New page added to IndexedDB:', "New Page");
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const savedNote = await db.notes.get({ title });
    console.log('Page selected from IndexedDB:', title);
    note = savedNote ? savedNote.note : '';
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg" on:click={() => selectPage(index)}>{page}</button>
        </li>
      {/each}
      <li class="text-center">
        <button class="font-medium" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="flex ml-auto">
      <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
      <button class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700 ml-2" on:click={deleteNote}>Delete</button>
    </div>
  </div>
  <input class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={title} type='text' placeholder='Add title'>
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
