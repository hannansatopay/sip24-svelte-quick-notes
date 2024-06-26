<script>
  import { onMount } from "svelte";
  import Dexie from 'dexie';

  // Initialize Dexie database
  const db = new Dexie('NotesDatabase');
  db.version(1).stores({
    notes: 'title, note'
  });

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  // On mount, load existing pages from IndexedDB
  onMount(async () => {
    try {
      const savedPages = await db.notes.toArray();
      if (savedPages.length > 0) {
        pages = savedPages.map(page => page.title);
        selectPage(0); 
      } else {
        addPage(); 
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  });

  // Save the current note
  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.notes.delete(storedPageName); // Delete old entry if title has changed
      pages[currentPageIndex] = title; // Update pages array
    }
    await db.notes.put({ title, note }); // Store or update the note in IndexedDB
    pages[currentPageIndex] = title; // Update pages array
  }

  // Add a new page
  function addPage() {
    const newPageTitle = `Page ${pages.length + 1}`;
    pages.push(newPageTitle);
    selectPage(pages.length - 1); 
  }

  // Select a specific page by index
  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const page = await db.notes.get(title);
    note = page ? page.note : ""; 
  }

  // Delete a page by index
  async function deletePage(index) {
    const pageToDelete = pages[index];
    await db.notes.delete(pageToDelete); // Delete from IndexedDB
    pages.splice(index, 1); // Remove from pages array
    if (pages.length === 0) {
      addPage(); // Add a new page if all pages are deleted
    } else {
      selectPage(index < pages.length ? index : pages.length - 1); // Select previous page
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-gray-200' : ''} py-2 px-3 text-gray-900 rounded-lg">
            {page}
          </button>
          <button on:click={() => deletePage(index)} class="text-red-500 font-bold">X</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ New page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900" on:click={saveNote}>
      Save
    </button>
  </div>
  <hr />
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  aside {
    background-color: #f3f4f6;
  }

  .bg-gray-200 {
    background-color: #e5e7eb;
  }

  .bg-light-gray {
    background-color: #f9fafb;
  }

  .text-red-500 {
    color: #ef4444;
  }

  .text-gray-900 {
    color: #111827;
  }
</style>
