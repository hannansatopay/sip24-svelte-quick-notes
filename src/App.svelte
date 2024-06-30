<script>
 import { onMount } from 'svelte';
 import { openDB } from 'idb';

 let db;
 let pages = [];
 let currentPageIndex = 0;
 let title = '';
 let notes = '';

 async function initDB() {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('notes', { keyPath: 'title' });
      },
    });
  }
  
  async function loadPages() {
    const tx = db.transaction('pages', 'readonly');
    const store = tx.objectStore('pages');
    pages = await store.getAll();
    if (pages.length) {
      currentPageIndex = 0;
      selectPage(0);
    } else {
      addPage();
    }
  }

 onMount(async() => {
  await initDB();
  await loadPages();
 })

 async function saveNote() {
    const storedPage = pages[currentPageIndex];
    if (storedPage.title !== title) {
      await db.delete('notes', storedPage.title);
      pages[currentPageIndex].title = title;
    }
    await db.put('notes', { title, notes });
    await db.put('pages', pages[currentPageIndex]);
  }

  async function addPage() { 
    const newPage = { title: 'New Page' };
    const id = await db.add('pages', newPage);
    newPage.id = id;
    pages.push(newPage);
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    const selectedPage = pages[currentPageIndex];
    title = selectedPage.title;
    const note = await db.get('notes', title);
    notes = note ? note.notes : '';
  }

  async function removePage(index) {
    const storedPage = pages[currentPageIndex];
    if (storedPage.title === title) {
      await db.delete('notes', title);
      await db.delete('pages', storedPage.id);
      pages.splice(currentPageIndex, 1);
      selectPage(pages.length ? pages.length - 1 : 0);
      loadPages();
    }
    if (currentPageIndex == 0){
      await initDB();
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
<div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border gray-200">
  <ul class="space-y-2">
    {#each pages as page, index}
    <li>
      <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} px-2 py-3 text-gray-900 rounded-lg">{page.title}</button>
    </li>
    {/each}
    <li class="text-center"><button on:click={addPage} class="ml-auto font-medium hover:bg-black hover:text-white px-5 py-2.5 rounded-lg">+ Add page</button></li>
  </ul>
</div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="grid grid-cols-2 items-center mb-3">
      <button class="ml-auto bg-gray-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
      <button class="ml-auto bg-gray-300 px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-800" on:click={removePage} >Delete</button>
    </div>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-200 rounded-lg text-gray-900 p-2.5" bind:value={notes}></textarea>
</main>

<style>
.bg-light-gray {
  background: #d3d3d3;
}
.bg-dark-gray {
  background: #a9a9a9
}
</style>