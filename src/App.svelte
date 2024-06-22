<script>
 
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { getNote, saveNoteToDB, deleteNoteFromDB, getAllNotes } from './indexedDB';
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  onMount(async () => {
    const savedPages = await getAllNotes();
    if (savedPages.length > 0) {
      pages = savedPages.map(page => page.title);
      selectPage(0);  // Select the first page on load
    } else {
      addPage();
    }
  });
  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await deleteNoteFromDB(storedPageName);
    }
    pages[currentPageIndex] = title;
    await saveNoteToDB({ title, note });
    pages = [...pages];  // Trigger reactivity
  }
  function addPage() {
    pages = [...pages, "New Page"];
    selectPage(pages.length - 1);
  }
  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = (await getNote(title))?.note || '';
  }
  async function deleteNote() {
    const pageToDelete = pages[currentPageIndex];
    await deleteNoteFromDB(pageToDelete);
    pages = pages.filter((_, i) => i !== currentPageIndex);
    
    if (pages.length === 0) {
      addPage();
    } else {
      const newIndex = currentPageIndex > 0 ? currentPageIndex - 1 : 0;
      selectPage(newIndex);
    }
  }
</script>
<main>
  Hello World
<aside class="fixed top-0 left-0 z-40 w-60 h-screen" in:slide={{ duration: 300 }} out:slide={{ duration: 300 }}>
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-sky-blue' : 'bg-light-gray'} py-2 px-3 text-gray-900 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">{page}</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium transition duration-300 ease-in-out transform hover:scale-105">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>
<main class="p-4 ml-60 h-auto transition-opacity duration-300 ease-in-out" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-sky-blue text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-light-sky-blue transition duration-300 ease-in-out transform hover:scale-105" on:click={saveNote}>Save</button>
    <button class="ml-3 bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-500 transition duration-300 ease-in-out transform hover:scale-105" on:click={deleteNote}>Delete</button>
  </div>
  <hr />
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5 transition-transform duration-300 ease-in-out transform hover:scale-101" bind:value={note}></textarea>
</main>
<style>
  .bg-light-gray {
    background: #F5F5F5;
  }
  .bg-dark-gray {
    background: #E5E7EB; /* Changed to a minimalistic gray for visibility */
  }
  .bg-sky-blue {
    background: #87CEEB;
  }
  .hover\:scale-101:hover {
    transform: scale(1.01);
  }
  .hover\:bg-light-sky-blue:hover {
    background: #B0E0E6;
  }
  .bg-red-600 {
    background: #dc2626;
  }
  .hover\:bg-red-500:hover {
    background: #ef4444;
  }
</style>