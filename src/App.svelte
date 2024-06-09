<script>
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let search = '';

  onMount(async () => {
    // Initialize Dexie database
    db = new Dexie('notes');
    db.version(1).stores({
      notes: '++id, title, note'
    });

    // Load pages from IndexedDB
    pages = await db.notes.toArray();

    if (pages.length === 0) {
      await addPage();
    } else {
      await selectPage(currentPageIndex);
    }
  });

  async function saveNote() {
    await db.notes.put({ title, note });
    pages = await db.notes.toArray();
  }

  async function addPage() {
    await db.notes.add({ title: 'New Page', note: '' });
    pages = await db.notes.toArray();
  }

  async function selectPage(index) {
    currentPageIndex = index;
    const selectedPage = await db.notes.get(pages[currentPageIndex].id);
    title = selectedPage.title;
    note = selectedPage.note;
  }

  async function deletePage() {
    await db.notes.delete(pages[currentPageIndex].id);
    pages = await db.notes.toArray();
    if (pages.length > 0) {
      await selectPage(0);
    } else {
      title = '';
      note = '';
      currentPageIndex = 0;
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <h1 class="p-5 block text-gray-900">Notes App 📝</h1>
  <div class="bg-light-gray overflow-y-auto py-3 px-3 h-full border-r border-gray-200">
    <input class="block w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 mb-3" type="text" placeholder="Search" bind:value={search}>
    <ul class="space-y-z">
      {#each pages as page, index}
      {#if page.title.toLowerCase().includes(search.toLowerCase())}
      <li>
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ?'bg-dark-gray' : ''} bg-dark-gray py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
      </li>
      {/if}
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
    <div class="mt-3">
      <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900" on:click={deletePage}>Delete</button>
    </div>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 item-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-900 rounded-lg px-2.5 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }

  .bg-dark-gray {
    background: #efefef;
  }
</style>
