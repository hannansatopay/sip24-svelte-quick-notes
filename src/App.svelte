<script>
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  const db = new Dexie('NotesDB');
  db.version(1).stores({
    pages: '++id, title, note'
  });

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  onMount(async () => {
    // @ts-ignore
    pages = await db.pages.toArray();
    if (pages.length > 0) {
      currentPageIndex = 0;
      title = pages[currentPageIndex].title;
      note = pages[currentPageIndex].note;
    } else {
      await addPage();
    }
  });

  async function saveNote() {
    const currentPage = pages[currentPageIndex];
    currentPage.title = title;
    currentPage.note = note;

    // @ts-ignore
    await db.pages.put(currentPage);
    // @ts-ignore
    pages = await db.pages.toArray();
  }

  async function addPage() {
    const newPage = { title: "New Page", note: "" };
    // @ts-ignore
    const id = await db.pages.add(newPage);
    // @ts-ignore
    pages = await db.pages.toArray();
    selectPage(pages.length - 1);
  }

  async function deleteNote() {
    if (pages.length > 0) {
      const id = pages[currentPageIndex].id;
      // @ts-ignore
      await db.pages.delete(id);
      // @ts-ignore
      pages = await db.pages.toArray();

      if (pages.length > 0) {
        selectPage(0);
      } else {
        title = "";
        note = "";
      }
    }
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].note;
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold col-span-2" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto space-x-2">
      <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-900" on:click={saveNote}>Save</button>
      <button class="bg-red-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-600" on:click={deleteNote}>Delete</button>
    </div>
  </div>
  <hr/>
  <textarea class="mt-3 mb-3 block w-full bg-gray-100 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background-color: #FBFBFB;
  }
  .bg-dark-gray {
    background-color: #EFEFEF;
  }
</style>
