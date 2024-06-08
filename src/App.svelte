<script>
  import { onMount } from "svelte";
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
        db.createObjectStore('metadata', { keyPath: 'key' });
      }
    });

    const savedPages = await db.get('metadata', 'pages');
    if (savedPages) {
      pages = savedPages.value;
      if (pages.length > 0) {
        title = pages[currentPageIndex];
        note = (await db.get('notes', title))?.note || '';
      }
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
    await db.put('notes', { title, note });
    await db.put('metadata', { key: 'pages', value: pages });
  }

  async function addPage() {
    pages.push('New Page');
    selectPage(pages.length - 1);
    await db.put('metadata', { key: 'pages', value: pages });
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = (await db.get('notes', title))?.note || '';
  }

  async function deletePage(index) {
    const pageTitle = pages[index];
    await db.delete('notes', pageTitle);
    pages.splice(index, 1);
    if (pages.length > 0) {
      currentPageIndex = index > 0 ? index - 1 : 0;
      title = pages[currentPageIndex];
      note = (await db.get('notes', title))?.note || '';
    } else {
      currentPageIndex = 0;
      title = '';
      note = '';
    }
    await db.put('metadata', { key: 'pages', value: pages });
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="color1 overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul>
      {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'color2' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
          <button on:click={() => deletePage(index)} class="ml-2 text-red-600">Delete Page</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class=" text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-green-600" on:click={saveNote}>Save</button>
  </div>
  <hr>
  <textarea class=" color1 mt-3 block w-full bg-black-500 border border-black-900 rounded-lg text-black-1900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .color1 {
    background: #dcd1d1;
  }
  .color2 {
    background: #b19a9a;
  }
</style>
