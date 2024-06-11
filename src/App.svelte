<script>
  import { onMount } from 'svelte';
  import db, { saveNoteToDB, getNoteFromDB, deleteNoteFromDB, getAllNotes } from './dexie.js';

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  onMount(async () => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      if (pages.length > 0) {
        title = pages[currentPageIndex] || "New Page";
        const savedNote = await getNoteFromDB(title);
        note = savedNote ? savedNote.note : "";
      } else {
        addPage();
      }
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
    await saveNoteToDB(title, note);
  }

  async function addPage() {
    pages.push("New Page");
    await saveNoteToDB("New Page", "");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const savedNote = await getNoteFromDB(title);
    note = savedNote ? savedNote.note : "";
  }

  async function deletePage() {
    if (pages.length === 1) {
      // If only one page, reset it instead of deleting
      title = "New Page";
      note = "";
      localStorage.setItem(title, note);
      await saveNoteToDB(title, note);
    } else {
      const pageToDelete = pages[currentPageIndex];
      localStorage.removeItem(pageToDelete);
      await deleteNoteFromDB(pageToDelete);
      pages.splice(currentPageIndex, 1);

      // Update the index to avoid out-of-bounds issues
      currentPageIndex = Math.min(currentPageIndex, pages.length - 1);

      title = pages[currentPageIndex];
      const savedNote = await getNoteFromDB(title);
      note = savedNote ? savedNote.note : "";
    }

    localStorage.setItem("pages", JSON.stringify(pages));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-royal-blue text-2xl' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium text-2xl h-12">
          <img src="/write.png" alt='' class="w-6 h-6 inline">
         Add Page
        </button>
      </li>
    </ul>
  </div>
</aside>

<main class="bg-royal-blue p-3 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex items-center space-x-2">
      <button class=" container text-black px-3.5 py-2 rounded-lg font-bold text-sm mt-3.5 hover:bg-gray-900" on:click={saveNote}>
        <img src="/plus.png" alt='' class="w-6 h-6 inline">
        Save
      </button>
      <button class="container px-2 py-2 rounded-lg text-sm mt-3 font-bold" on:click={deletePage}>
        <img src="/delete.png" alt='' class="w-6 h-6 inline">
        Delete
      </button>
    </div>
  </div>
  <hr/>
  <textarea class="container mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #C6AFC6;
  }

  .bg-dark-gray {
    background: #E8D0D0;
  }

  .bg-royal-blue {
    background: #EEDBD8;
  }

  .bg-voilet {
    background-color: #cf9aff;
  }
</style>
