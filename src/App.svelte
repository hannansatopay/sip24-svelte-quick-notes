<script>
  import { onMount } from 'svelte';
  import db from './db.js';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    try {
      const savedPages = await db.pages.toArray();
      if (savedPages.length > 0) {
        pages = savedPages.map(page => page.title);
        title = pages[currentPageIndex];
        const currentNote = await db.pages.get({ title });
        note = currentNote ? currentNote.content : '';
      } else {
        addPage();
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  });

  async function saveNote() {
    try {
      const storedPageName = pages[currentPageIndex];
      if (storedPageName !== title) {
        await db.pages.where({ title: storedPageName }).delete();
        pages[currentPageIndex] = title;
      }
      await db.pages.put({ title, content: note });
    } catch (error) {
      console.error('Error saving note:', error);
    }
  }

  async function deleteNote() {
    const storedPageName = pages[currentPageIndex];
    await db.pages.where({ title: storedPageName }).delete();
    pages.splice(currentPageIndex, 1);

    if (pages.length > 0) {
      selectPages(pages.length - 1);
    } else {
      title = '';
      note = '';
      currentPageIndex = 0;
    }  
  }

  function addPage() {
    pages.push('New Note');
    selectPages(pages.length - 1);
  }

  async function selectPages(index) {
    try {
      currentPageIndex = index;
      title = pages[currentPageIndex];
      const currentNote = await db.pages.get({ title });
      note = currentNote ? currentNote.content : '';
    } catch (error) {
      console.error('Error selecting note:', error);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-gray-200 overflow-y-auto py-5 px-3 h-full border border-gray-300">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={() => selectPages(index)} class="{index == currentPageIndex ? 'bg-gray-300' : ''} py-2 px-3 text-gray-900 font-medium rounded-lg border border-gray-300 hover:bg-gray-400">{page}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium text-gray-900">+Add Note</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="flex items-center mb-3">
    <h1 class="text-3xl font-medium flex-grow" contenteditable bind:textContent={title}></h1>
    <div class="flex space-x-2">
      <button class="bg-gray-800 text-gray-300 px-5 py-2.5 rounded-lg font-medium mt-2 hover:bg-gray-900" on:click={saveNote}>Save</button>
      <button class="bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg font-medium mt-2 hover:bg-red-600 hover:text-gray-200" on:click={deleteNote}>Delete</button>
    </div>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full h-auto bg-gray-200 border border-white rounded-lg text-gray-800 p-2.5" bind:value={note} placeholder="Start writing..."></textarea>
</main>

<style>

</style>
