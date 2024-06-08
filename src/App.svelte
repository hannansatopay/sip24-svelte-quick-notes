<script>
  import { onMount } from "svelte";
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let db;

  onMount(async () => {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
        db.createObjectStore('pages', { autoIncrement: true });
      }
    });

    const savedPages = await db.getAll('pages');
    if (savedPages.length) {
      pages = savedPages;
      title = pages[currentPageIndex].title;
      note = (await db.get('notes', title))?.note || '';
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex].title;
    if (storedPageName != title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex].title = title;
    }
    await db.put('notes', { title, note });
    await db.put('pages', pages[currentPageIndex], currentPageIndex);
  }

  async function addPage() {
    const newPage = { title: "New Page" };
    pages.push(newPage);
    selectPage(pages.length ? pages.length - 1 : 0);
    await db.add('pages', newPage);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = (await db.get('notes', title))?.note || '';
  }

  async function deletePage(index) {
    const pageTitle = pages[index].title;
    await db.delete('notes', pageTitle);
    pages.splice(index, 1);
    if (index <= currentPageIndex && currentPageIndex > 0) {
      currentPageIndex--;
    }
    if (pages.length > 0) {
      selectPage(currentPageIndex);
    } else {
      addPage();
    }
    await db.clear('pages');
    for (let i = 0; i < pages.length; i++) {
      await db.add('pages', pages[i], i);
    }
  }
</script>

<main>
  Hello World
  <aside class="fixed top-0 left-0 z-40 w-60 h-screen">
    <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
      <ul class="space-y-2">
        {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">
            {page.title}
          </button>
          <button on:click={() => deletePage(index)} class="text-red-500 ml-2">Delete</button>
        </li>
        {/each}
        <li class="text-center">
          <button on:click={addPage} class="font-medium ">+ Add page</button>
        </li>
      </ul>
    </div>
  </aside>
</main>

<main class="p-6 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}>{title || "New Page"}</h1>
    <button class="ml-auto bg-gray-600 text-white px-5 py-2.5 rounded-lg font-medium font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr />
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }
  .bg-dark-gray {
    background: #efefee;
  }
</style>
