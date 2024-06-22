<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = ["New Page"];
  let currentPageIndex = 0;
  let title = "New Page";
  let note = "";

  let db;

  onMount(async () => {
    db = await openDB('notes-db', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
      }
    });

    const storedPages = await db.getAllKeys('notes');
    if (storedPages.length > 0) {
      pages = storedPages.map(key => String(key));
      title = pages[currentPageIndex];
      const storedNote = await db.get('notes', title);
      note = storedNote ? storedNote.content : '';
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex] = title;
    }
    await db.put('notes', { title, content: note });
    pages[currentPageIndex] = title;
  }

  function addPage() {
    title = 'New Page';
    note = '';
    pages.push(title);
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const storedNote = await db.get('notes', title);
    note = storedNote ? storedNote.content : '';
  }

  async function deletePage() {
    if (pages.length > 0) {
      const pageToDelete = pages[currentPageIndex];
      await db.delete('notes', pageToDelete);
      pages.splice(currentPageIndex, 1);

      if (pages.length === 0) {
        // If all pages are deleted, reset to a new default page
        title = "New Page";
        note = "";
        pages = ["New Page"];
        currentPageIndex = 0;
      } else {
        // Adjust the current page index to a valid page
        if (currentPageIndex >= pages.length) {
          currentPageIndex = pages.length - 1;
        }
        title = pages[currentPageIndex];
        const storedNote = await db.get('notes', title);
        note = storedNote ? storedNote.content : '';
      }
    }
  }
</script>

<!-- A Sidebar to add new pages -->
<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add Page</button>
        <button on:click={deletePage} class="font-medium ml-2">- Delete Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
