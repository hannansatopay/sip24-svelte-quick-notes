<script>
  import { onMount } from 'svelte';
  import db from './db';


  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';


  onMount(async() => {
    pages = await db.notes.toArray();
    if (pages.length > 0) {
      selectPage(0);
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPage = pages[currentPageIndex];
    if (storedPage.title !== title) {
      await db.notes.delete(storedPage.id);
      pages[currentPageIndex].title = title;
    }
    await db.notes.put({ id: storedPage.id, title, content: note });
    pages = await db.notes.toArray();
  }

  async function addPage() {
    const newPage = { title: 'New Page', content: '' };
    const id = await db.notes.add(newPage);
    newPage.id = id;
    pages.push(newPage);
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].content;
  }
  async function deletePage() {
    const pageToDelete = pages[currentPageIndex];
    await db.notes.delete(pageToDelete.id);
    pages.splice(currentPageIndex, 1);
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
    }
    pages = await db.notes.toArray();
    alert('Note deleted');
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-gray-800 overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 font-medium rounded-lg">{page.title}</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-normal text-gray-50">+ Add page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex space-x-2">
      <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
    </div>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  <button class="bg-red-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-900" on:click={deletePage}>Delete</button>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }
  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>