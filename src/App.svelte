
<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = [];
  let currIndex = 0;
  let title = "";
  let note = "";
  let db;

  onMount(async () => {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
        db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
      },
    });

    const savedPages = await db.getAll('pages');
    if (savedPages.length) {
      pages = savedPages.map(page => page.title);
      title = pages[currIndex];
      note = (await db.get('notes', title))?.note || "";
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currIndex];
    if (storedPageName != title) {
      await db.delete('notes', storedPageName);
      pages[currIndex] = title;
    }

    await db.put('notes', { title, note });
    await db.put('pages', { id: currIndex + 1, title });
  }

  async function addPage() {
    pages.push("New page");
    await db.put('pages', { id: pages.length, title: "New page" });
    selectPage(pages.length - 1);
  }

  async function deleteNote() {
    const deletedPage = pages.splice(currIndex, 1)[0];
    await db.delete('notes', deletedPage);
    await db.delete('pages', currIndex + 1);
    if (pages.length) {
      selectPage(Math.max(0, currIndex - 1));
    } else {
      addPage();
    }
  }

  async function selectPage(index) {
    currIndex = index;
    title = pages[currIndex];
    note = (await db.get('notes', title))?.note || "";
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-gray-200 border-r">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <div class="flex justify-between items-center">
            <button on:click={() => selectPage(index)} class="bg-dark-gray px-4 py-2 rounded-lg text-white">{page}</button>
            <button on:click={deleteNote} class="ml-2 text-red-500">🗑</button>
          </div>
        </li>
      {/each}
      <li class="text-center"><button class="font-medium" on:click={addPage}>+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="col-span-2 text-3xl font-bold" contenteditable bind:textContent={title}>{title || "New page"}</h1>
    <div class="flex justify-end space-x-2">
      <button on:click={saveNote} class="bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700">Save</button>
      <button on:click={deleteNote} class="bg-red-500 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
    </div>
  </div>
  <hr/>
  <textarea bind:value={note} class="block w-full mt-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }

  .bg-dark-gray {
    background: #793ed8;
  }
</style>

 