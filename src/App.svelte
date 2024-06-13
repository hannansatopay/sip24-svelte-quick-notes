<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  // Initialize the IndexedDB
  const dbPromise = openDB('notes-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'title' });
      }
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
      await addPage(); // Add a new page only if there are no existing pages
    }
  });

  async function saveNote() {
    const db = await dbPromise;
    const page = pages[currentPageIndex];
    page.title = title;
    await db.put('notes', { title, note });
    await db.put('pages', page);

    // Reload the list of pages
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
    const noteObj = await db.get('notes', title);
    note = noteObj ? noteObj.note : "";
  }

  async function deleteNote() {
    if (confirm("Are you sure you want to delete this note?")) {
      const db = await dbPromise;
      const page = pages[currentPageIndex];
      await db.delete('notes', page.title);
      await db.delete('pages', page.id);

      pages.splice(currentPageIndex, 1);

      if (currentPageIndex >= pages.length) {
      selectPage(pages.length - 1);
      }
      const allPages = await db.getAll('pages');
      pages = allPages;

      //if (pages.length === 0) {
      //  await addPage(); // Add a new page if all notes are deleted
      //} else {
      //  selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
      //}
    }
  }
</script>

<aside class="fixed top-0 left-0 z-0 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class="bg-dark-gray py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
      </li>
      {/each}
      <li class="text-left"><button on:click={addPage} class="font-medium">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-green-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-green-900" on:click={saveNote}>Save</button>
  </div>
  <hr />
  <textarea class="mt-3 block w-full bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-900 p-2.5" bind:value={note}></textarea>
  <button class="mt-3 bg-red-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-900" on:click={deleteNote}>Delete Note</button>
</main>

<style>
  :global(body) {
    background-color: #a9b5e7;
    margin: 0;
    font-family: Arial, sans-serif;
  }

  .bg-light-gray {
    background: #8598c8;
  }

  .bg-dark-gray {
    background: #8397d2;
  }

  aside {
    height: 100vh;
  }
</style>