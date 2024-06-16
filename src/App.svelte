<script>
  import { onMount } from 'svelte';
  import db from './db';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    pages = await db.pages.toArray();
    if (pages.length) {
      selectPage(0);
    } else {
      addPage();
    }
  });

  async function saveNote() {
    if (!title) {
      alert('Title cannot be empty');
      return;
    }

    const currentPage = pages[currentPageIndex];
    if (currentPage.title !== title) {
      await db.pages.delete(currentPage.id);
      pages[currentPageIndex].title = title;
    }
    pages[currentPageIndex].note = note;
    await db.pages.put(pages[currentPageIndex]);
    pages = await db.pages.toArray();  // Refresh the pages array
  }

  async function addPage() {
    const newPage = { title: 'New Page', note: '' };
    const id = await db.pages.add(newPage);
    newPage.id = id;
    pages.push(newPage);
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].note;
  }

  async function deletePage(index) {
    const pageToDelete = pages[index];
    await db.pages.delete(pageToDelete.id);
    pages.splice(index, 1);
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(index === currentPageIndex ? (index > 0 ? index - 1 : 0) : currentPageIndex);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable="true" bind:textContent={title}></h1>
  </div>
  <input class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={title} type='text' placeholder='Add title'>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note} placeholder="Add note..."></textarea>
  
  <div class="flex space-x-[5mm]">
    <button class="bg-gray-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
    <button class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700" on:click={() => deletePage(currentPageIndex)}>Delete</button>
  </div>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB; 
  }
  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
