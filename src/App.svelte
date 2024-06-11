<script>
  import { onMount } from "svelte";
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  let db;

  onMount(async () => {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
        db.createObjectStore('pages', { keyPath: 'index' });
      },
    });

    const storedPages = await db.getAll('pages');
    if (storedPages.length) {
      pages = storedPages.map(page => page.title);
      title = pages[currentPageIndex];
      note = (await db.get('notes', title)).content;
    } else {
      addPage();
    }
  });

  async function addPage() {
    const newPageTitle = `New Page ${pages.length + 1}`;
    pages.push(newPageTitle);
    await db.put('pages', { index: pages.length - 1, title: newPageTitle });
    selectPage(pages.length - 1);
  }

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex] = title;
      await db.put('pages', { index: currentPageIndex, title });
    }
    await db.put('notes', { title, content: note });
  }

  async function deleteNote() {
    const storedPageName = pages[currentPageIndex];
    await db.delete('notes', storedPageName);
    await db.delete('pages', currentPageIndex);
    pages.splice(currentPageIndex, 1);

    if (pages.length === 0) {
      addPage();
    } else {
      currentPageIndex = currentPageIndex > 0 ? currentPageIndex - 1 : 0;
      title = pages[currentPageIndex];
      note = (await db.get('notes', title)).content;
    }

    await db.put('pages', { index: currentPageIndex, title });
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = (await db.get('notes', title)).content;
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-green-600' : 'bg-white-100'} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+Add page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto block mt-3 px-5 py-2.5 font-medium text-sm text-white rounded-lg border-black bg-green-800 hover:text-lg hover:text-blue" on:click={saveNote}>Save</button>
    <button class="ml-auto block mt-3 px-5 py-2.5 font-medium text-sm text-white rounded-lg border-black bg-red-800 hover:text-lg hover:text-blue" on:click={deleteNote}>Delete</button>
  </div>
  <hr />
  <textarea class="mt-4 block w-full bg-gray-200 rounded-lg" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }
  .bg-dark-gray {
    background: #efefef;
  }
</style>
