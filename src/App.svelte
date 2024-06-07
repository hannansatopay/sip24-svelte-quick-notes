<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  let db;

  onMount(async () => {
    db = await openDB('notesApp', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
      },
    });

    const savedPages = await db.getAllKeys('notes');
    if (savedPages.length) {
      pages = savedPages;
      title = pages[currentPageIndex];
      const savedNote = await db.get('notes', title);
      note = savedNote ? savedNote.content : '';
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex] = title;
    }

    await db.put('notes', { title, content: note });
    await db.put('notes', { title: 'pages', content: JSON.stringify(pages) });
  }

  async function addPage() {
    pages.push('New Page');
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  async function deletePage(index) {
    const pageTitle = pages[index];
    await db.delete('notes', pageTitle);
    pages.splice(index, 1);
    if (index === currentPageIndex) {
      currentPageIndex = pages.length ? 0 : -1;
      if (currentPageIndex !== -1) {
        title = pages[currentPageIndex];
        const savedNote = await db.get('notes', title);
        note = savedNote ? savedNote.content : '';
      } else {
        title = '';
        note = '';
      }
    }
    await db.put('notes', { title: 'pages', content: JSON.stringify(pages) });
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const savedNote = await db.get('notes', title);
    note = savedNote ? savedNote.content : '';
  }
</script>

<aside class="fixed top-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex items-center justify-between">
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
          <button on:click={() => deletePage(index)} class="text-red-500 ml-2">Delete</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}>{title || 'New Page'}</h1>
    <button class="ml-auto bg-dark-gray py-2 px-3 text-gray-900 rounded-lg">Page Title</button>
  </div>
  <hr/>
  <input class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={title} type='text'>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }
  
  .bg-dark-gray {
    background: #EFEFEF;
  }
  
  .text-red-500 {
    color: red;
  }
</style>
