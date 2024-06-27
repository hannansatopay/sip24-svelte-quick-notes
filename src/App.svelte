<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('notes')) {
          db.createObjectStore('notes', { keyPath: 'title' });
        }
        if (!db.objectStoreNames.contains('pages')) {
          db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
        }
      },
    });

    const savedPages = await db.getAll('pages');
    if (savedPages.length > 0) {
      pages = savedPages.map(page => page.title);
      title = pages[currentPageIndex];
      note = (await db.get('notes', title))?.content || '';
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex] = title;
      await db.put('pages', { id: currentPageIndex, title });
    }
    await db.put('notes', { title, content: note });
    await db.put('pages', { id: currentPageIndex, title });
  }

  async function addPage() {
    const newPageTitle = 'new page';
    pages.push(newPageTitle);
    const newPageIndex = pages.length - 1;
    await db.put('pages', { id: newPageIndex, title: newPageTitle });
    selectPage(newPageIndex);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const noteData = await db.get('notes', title);
    note = noteData ? noteData.content : '';
  }

  async function deletePage(index) {
    const pageToDelete = pages[index];
    await db.delete('notes', pageToDelete);
    await db.delete('pages', index);
    pages.splice(index, 1);

    if (pages.length > 0) {
      if (index === currentPageIndex) {
        selectPage(index === 0 ? 0 : index - 1);
      } else if (index < currentPageIndex) {
        currentPageIndex--;
      }
    } else {
      addPage();
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-purple-100 overflow-y-auto py-5 px-3 h-full border-r border-purple-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li class="flex justify-between items-center">
        <button on:click={() => { selectPage(index) }} class="{index == currentPageIndex ? 'bg-purple-300' : '' } py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        <button on:click={() => { deletePage(index) }} class="text-red-500 ml-2">Delete</button>
      </li>
      {/each}
      <li class="text-center"><button class="font-medium" on:click={addPage}>+Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-purple-900" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-400 rounded-lg text-gray-900" bind:value={note}></textarea>
</main>

<style>
  .bg-purple-100 {
    background: #F3E5F5;
  }

  .bg-purple-300 {
    background: #CE93D8;
  }

  .bg-purple-700 {
    background: #8E24AA;
  }

  .hover\:bg-purple-900:hover {
    background: #4A148C;
  }

  aside {
    background: linear-gradient(135deg, #EDE7F6 0%, #E1BEE7 100%);
    border-right: 1px solid #D1C4E9;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
  
  h1[contenteditable] {
    border: 1px solid #D1C4E9;
    padding: 5px;
    border-radius: 5px;
  }

  textarea {
    min-height: 300px;
    padding: 10px;
  }

  button {
    cursor: pointer;
  }
</style>