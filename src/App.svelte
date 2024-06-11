<script>
  import { onMount } from 'svelte';
  import db from './db.js';

  let pages = [];
  let currentPage = null;
  let title = '';
  let note = '';

  onMount(async () => {
    pages = await db.pages.toArray();
    if (pages.length > 0) {
      selectPage(pages[0]);
    } else {
      addPage();
    }
  });

  async function saveCurrentNote() {
    if (!currentPage) return;

    if (currentPage.title !== title) {
      await db.notes.delete(currentPage.title);
      currentPage.title = title;
      await db.pages.put(currentPage);
    }

    await db.notes.put({ title, content: note });
    pages = await db.pages.toArray();
  }

  async function addPage() {
    const newPage = { title: 'New Page' };
    const id = await db.pages.add(newPage);
    newPage.id = id;
    pages.push(newPage);
    selectPage(newPage);
  }

  async function selectPage(page) {
    currentPage = page;
    title = page.title;
    const noteRecord = await db.notes.get(title);
    note = noteRecord ? noteRecord.content : '';
  }

  async function deleteCurrentPage() {
    if (!currentPage) return;

    await db.pages.delete(currentPage.id);
    await db.notes.delete(currentPage.title);
    pages = await db.pages.toArray();

    if (pages.length > 0) {
      selectPage(pages[0]);
    } else {
      addPage();
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page}
        <li>
          <button on:click={() => selectPage(page)} class="{page.id === currentPage?.id ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold transition-all duration-400" contenteditable bind:textContent={title}></h1>
    <div class="flex justify-end">
      <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 mr-3 hover:bg-gray-900" on:click={saveCurrentNote}>Save</button>
      <button class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700" on:click={deleteCurrentPage}>Delete</button>
    </div>
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
