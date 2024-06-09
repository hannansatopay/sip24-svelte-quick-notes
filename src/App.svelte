<script>
  import { onMount } from 'svelte';
  import { initDB, getPages, savePage, deletePage, saveNote, getNote, deleteNote } from './db';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    db = await initDB();
    const savedPages = await getPages(db);
    if (savedPages.length) {
      pages = savedPages; 
      title = pages[currentPageIndex].title;
      note = await getNote(db, title) || '';
    } else {
      addPage();
    }
  });

  async function saveNoteHandler() {
    const storedPage = pages[currentPageIndex];
    if (storedPage.title !== title) {
      await deleteNote(db, storedPage.title);
      pages[currentPageIndex].title = title;
      await savePage(db, pages[currentPageIndex]);
    }
    await saveNote(db, title, note);
  }

  async function addPage() {
    const newPage = { title: 'New Page' };
    const id = await savePage(db, newPage);
    newPage.id = id;
    pages.push(newPage);
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = await getNote(db, title) || '';
  }

  async function deletePageHandler() {
    if (pages.length > 1) {
      await deleteNote(db, title);
      await deletePage(db, pages[currentPageIndex].id);
      pages.splice(currentPageIndex, 1);
      if (currentPageIndex >= pages.length) {
        currentPageIndex = pages.length - 1;
      }
      selectPage(currentPageIndex);
    } else {
      alert("Cannot delete the last page.");
    }
  }
</script>

<main>
  Hello World
  <aside class="fixed top-0 left-0 z-40 w-60 h-screen">
    <div class="bg-light-blue overflow-y-auto py-5 h-full border-r border-blue-300">
      <ul class="space-y-2">
        {#each pages as page, index}
          <li class="px-4">
            <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} text-1xl py-2 px-3 font-bold text-gray-800 rounded-lg">
              {page.title}
            </button>
          </li>
        {/each}
        <li class="text-center">
          <button on:click={addPage} class="font-medium">+ Add Page</button>
        </li>
      </ul>
    </div>
  </aside>

  <main class="p-4 ml-60 h-auto">
    <div class="grid grid-cols-2 items-center mb-3">
      <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}>{title || "New Note"}</h1>
      <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-500" on:click={saveNoteHandler}>Save</button>
    </div>
    <hr />
    <textarea class="mt-3 block w-full bg-green-50 border border-black-300 rounded-lg text-gray-800 p-2.5" bind:value={note}></textarea>
    <button class="fixed bottom-4 right-4 bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-500" on:click={deletePageHandler}>Delete</button>
  </main>
</main>

<style>
  .bg-light-blue {
    background: #a8a8a8;
  }
  .bg-dark-gray {
    background: #e3a2a2;
  }
</style>
