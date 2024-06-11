<script>
  import Dexie from 'dexie';
  import { onMount } from 'svelte';

  let title = "New Page";
  let note = "";
  let pages = [];
  let currentPageIndex = 0;

  // Initialize Dexie database
  const db = new Dexie('notesDB');
  db.version(1).stores({
    notes: '++id,title,note',
    pages: '++id,title'
  });

  onMount(async () => {
    const savedPages = await db.pages.toArray();
    if (savedPages.length) {
      pages = savedPages.map(page => page.title);
      title = pages[currentPageIndex];
      const savedNote = await db.notes.where({ title }).first();
      note = savedNote ? savedNote.note : '';
    } else {
      addPage();
    }
  });

  async function addPage() {
    const newPageTitle = "New Page";
    const newPage = { title: newPageTitle };
    await db.pages.add(newPage);
    pages.push(newPageTitle);
    selectPage(pages.length - 1);
  }

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.pages.where({ title: storedPageName }).modify({ title });
      pages[currentPageIndex] = title;
    }
    await db.notes.put({ title, note });
    await db.pages.put({ title });
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const savedNote = await db.notes.where({ title }).first();
    note = savedNote ? savedNote.note : '';
  }

  async function deletePage(index) {
    const pageToDelete = pages[index];
    await db.notes.where({ title: pageToDelete }).delete();
    await db.pages.where({ title: pageToDelete }).delete();
    pages.splice(index, 1);

    // Handle current page index after deletion
    if (index === currentPageIndex) {
      currentPageIndex = Math.max(0, currentPageIndex - 1);
    } else if (index < currentPageIndex) {
      currentPageIndex -= 1;
    }

    if (pages.length > 0) {
      selectPage(currentPageIndex);
    } else {
      addPage();
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} bg-dark-gray py-2 px-3 text-gray-900 rounded-lg">{page}</button>
          <button on:click={() => deletePage(index)} class="ml-2 text-red-500">Delete</button>
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
    <input class="text-3xl font-bold w-full border-none focus:ring-0" bind:value={title} />
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
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
