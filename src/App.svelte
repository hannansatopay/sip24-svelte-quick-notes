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

<aside class="fixed top-0 w-60 left-0 h-screen ">
  <div class="bg-light-gray py-5 px-2.5 overflow-y-auto h-full borer-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index }
        <li><button on:click={()=>selectPage(index)} class="{index==currentPageIndex ? "bg-dark-gray" : ''} text-gray-900 rounded-lg px-2 py-3">{page.title}</button></li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto">
      <button on:click={deletePage} class="bg-white-700 hover:bg-red-100 text-red-600 text-size-sm border border-red-400 rounded-lg px-5 py-2.5 mt-3 ">Delete</button>
      <button on:click={saveNote} class="bg-gray-700 hover:bg-gray-900 text-white text-size-sm rounded-lg px-5 py-2.5 mt-3 ">Save</button>
    </div>

  </div>
  <hr/>
  <textarea class="block w-full border border-gray-300 bg-gray-50 rounded-lg p-2 mt-3" bind:value={note} placeholder="enter your note"></textarea>

</main>

<style>
  .bg-light-gray{
    background:#FBFBFB;
  }
  .bg-dark-gray{
    background: #efefef;
  }

  hr {
    top: 20px;
    bottom: 20px;
    height: 2px;
    background: rgb(16, 16, 16);
  }
</style>
