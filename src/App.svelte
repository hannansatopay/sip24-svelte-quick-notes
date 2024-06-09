<script>
  import { onMount } from 'svelte';
  import { getPages, getPage, savePage, deletePage as deletePageFromDB } from './db.js';

  let note = '';
  let title = '';
  let pages = [];
  let currentPageIndex = 0;

  onMount(async () => {
    pages = await getPages();
    if (pages.length > 0) {
      selectPage(0);
    }
  });

  async function saveNote() {
    const savedPage = pages[currentPageIndex];
    if (savedPage.title !== title || savedPage.note !== note) {
      savedPage.title = title;
      savedPage.note = note;
      await savePage(savedPage);
      pages = await getPages(); // refresh pages from DB
    }
  }

  async function addPage() {
    const newPage = { title: 'New Page', note: '' };
    const id = await savePage(newPage);
    pages = await getPages(); // refresh pages from DB
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    const page = await getPage(pages[currentPageIndex].id);
    title = page.title;
    note = page.note;
  }

  async function deletePage() {
    const pageId = pages[currentPageIndex].id;
    await deletePageFromDB(pageId);
    pages = await getPages(); // refresh pages from DB
    if (pages.length > 0) {
      selectPage(pages.length - 1);
    } else {
      title = '';
      note = '';
    }
  }
</script>

<aside class="fixed top-0 left-0 w-60 z-40 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-2 rounded-lg text-gray-900">{page.title}</button>
        </li>
      {/each}
      <li class="text-center">
        <button class="font-medium" on:click={addPage}> + Add Page </button>
      </li>
      <li class="text-center">
        <button class="font-medium" on:click={deletePage}> - Delete Page </button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-500 text-white mt-3 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900" on:click={saveNote}>Save</button>
    <hr />
  </div>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-400 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background-color: #fbfbfb;
  }
  .bg-dark-gray {
    background-color: #ebebeb;
  }
</style>
