<script>
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  // Initialize Dexie database
  const db = new Dexie('notesDatabase');
  db.version(1).stores({
    pages: '++id, title, note'
  });

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    const savedPages = await db.pages.toArray();
    if (savedPages.length > 0) {
      pages = savedPages;
      title = pages[currentPageIndex].title;
      note = pages[currentPageIndex].note;
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const currentPage = pages[currentPageIndex];
    if (currentPage.title !== title || currentPage.note !== note) {
      await db.pages.put({ id: currentPage.id, title, note });
      pages[currentPageIndex] = { id: currentPage.id, title, note };
    }
  }

  async function addPage() {
    const newPage = { title: "New Page", note: "" };
    const id = await db.pages.add(newPage);
    newPage.id = id;
    pages.push(newPage);
    currentPageIndex = pages.length - 1;
    title = "New Page";
    note = "";
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].note;
  }

  async function deletePage() {
    if (pages.length > 1) {
      const pageToDelete = pages[currentPageIndex];
      await db.pages.delete(pageToDelete.id);
      pages.splice(currentPageIndex, 1);
      if (currentPageIndex >= pages.length) {
        currentPageIndex = pages.length - 1;
      }
      title = pages[currentPageIndex].title;
      note = pages[currentPageIndex].note;
    } else {
      await db.pages.clear();
      pages = [];
      addPage();
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="big-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-2">
      {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex gap-2">
      <button class="bg-gray-800 text-white px-5 py-.25 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
      <button class="bg-red-600 text-white px-5 py-.25 rounded-lg font-medium text-sm mt-3 hover:bg-red-700" on:click={deletePage}>Delete</button>
    </div>
  </div>

  <textarea class="mt-3 block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }

  .bg-dark-gray {
    background: #e5e5e5;
  }
</style>
