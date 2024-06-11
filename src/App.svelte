<script>
  import { onMount } from 'svelte';
  import db, { saveNoteToIndexedDB, getNoteFromIndexedDB, deleteNoteFromIndexedDB, getAllTitlesFromIndexedDB } from './dexie';

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  onMount(async () => {
    const savedPages = await getAllTitlesFromIndexedDB();
    if (savedPages.length > 0) {
      pages = savedPages.map(page => page.title);
      title = pages[currentPageIndex] || "New Page";
      const savedNote = await getNoteFromIndexedDB(title);
      note = savedNote ? savedNote.note : "";
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await deleteNoteFromIndexedDB(storedPageName);
      pages[currentPageIndex] = title;
    }
    await saveNoteToIndexedDB(title, note);
  }

  async function addPage() {
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const savedNote = await getNoteFromIndexedDB(title);
    note = savedNote ? savedNote.note : "";
  }

  async function deletePage() {
    if (pages.length === 1) {
      // If only one page, reset it instead of deleting
      title = "New Page";
      note = "";
      await saveNoteToIndexedDB(title, note);
    } else {
      const pageToDelete = pages[currentPageIndex];
      await deleteNoteFromIndexedDB(pageToDelete);
      pages.splice(currentPageIndex, 1);

      // Update the index to avoid out-of-bounds issues
      currentPageIndex = Math.min(currentPageIndex, pages.length - 1);

      title = pages[currentPageIndex];
      const savedNote = await getNoteFromIndexedDB(title);
      note = savedNote ? savedNote.note : "";
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'text-2xl bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-bold">
          <img src="/icon_note.png" class="w-5 h-5 inline">
         Add Page
        </button>
      </li>
    </ul>
  </div>
</aside>

<main class="bg-light-gray p-3 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex items-center space-x-2">
      <button class="container text-black px-3.5 py-2 rounded-lg font-bold text-sm mt-3.5 hover:bg-gray-900" on:click={saveNote}>
        <img src="/icon_save.png" alt="" class="w-5 h-5 inline">
        Save
      </button>
      <button class="px-2 py-2 rounded-lg text-sm mt-3 hover:bg-gray-900" on:click={deletePage}>
        <img src="/icon_trash.png" alt="" class="w-10 h-6 inline">
      </button>
    </div>
  </div>
  <hr/>
  <textarea class="container mt-3 block w-full border border-gray-300 rounded-lg text-gray-900 p-.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #d3cbea;
  }

  .bg-purple {
    background: #9382A7;
  }
  
  .bg-dark-gray {
    background: #8e9baf;
  }

  .bg-royal-blue {
    background: rgb(48, 44, 41);
  }
</style>