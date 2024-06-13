<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  const dbPromise = openDB('notesDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('pages')) {
        const store = db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
        store.createIndex('name', 'name', { unique: true });
      }
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'title' });
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
    const storedPageName = page.name;
    if (storedPageName !== title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex].name = title;
    }
    await db.put('notes', { title, content: note });
    await db.put('pages', { ...page, name: title });
    pages = await db.getAll('pages');
  }

  async function addPage() {
    const db = await dbPromise;
    const newTitle = 'New Page';
    const id = await db.add('pages', { name: newTitle });
    const newPage = { id, name: newTitle };
    pages.push(newPage);
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    const page = pages[currentPageIndex];
    title = page.name;
    const db = await dbPromise;
    const noteObj = await db.get('notes', title);
    note = noteObj ? noteObj.content : '';
  }

  async function deletePage() {
    if (confirm("Are you sure you want to delete this page?")) {
      const db = await dbPromise;
      const page = pages[currentPageIndex];
      await db.delete('notes', page.name);
      await db.delete('pages', page.id);
      pages.splice(currentPageIndex, 1);
      if (pages.length === 0) {
        await addPage();
      } else {
        selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
      }
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page.name}</button>
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
    <div class="flex justify-end space-x-2">
      <button on:click={saveNote} class="w-20 bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900">Save</button>
      <button on:click={deletePage} class="w-20 bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700">Delete</button>
    </div>
  </div>
  <hr/>
  <textarea bind:value={note} class="block w-full mt-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 p-2.5"></textarea>
</main>

<style>
  :global(body) {
    background-color: #a9b5e7;
    margin: 0;
    font-family: Arial, sans-serif;
  }

  .bg-light-gray {
    background: #fbfbfb;
  }

  .bg-dark-gray {
    background: #efefef;
  }

  hr {
    top: 20px;
    bottom: 20px;
    height: 2px;
    background: rgb(16, 16, 16);
  }
</style>
