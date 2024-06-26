<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let db;

  onMount(async () => {
    db = await openDB('notes-db', 1, {
      upgrade(db) {
        db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('notes', { keyPath: 'title' });
      }
    });

    const savedPages = await db.getAll('pages');
    if (savedPages.length > 0) {
      pages = savedPages.map(page => page.title);
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
      await db.put('pages', { id: currentPageIndex + 1, title });
    }
    await db.put('notes', { title, content: note });
  }

  async function addPage() {
    const newPageTitle = "New Page";
    pages.push(newPageTitle);
    const newIndex = pages.length - 1;
    await db.add('pages', { id: newIndex + 1, title: newPageTitle });
    selectPage(newIndex);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const savedNote = await db.get('notes', title);
    note = savedNote ? savedNote.content : '';
  }

  async function deleteNote() {
    const storedPageName = pages[currentPageIndex];
    await db.delete('notes', storedPageName);
    await db.delete('pages', currentPageIndex + 1);
    pages.splice(currentPageIndex, 1);
    if (pages.length > 0) {
      selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
    } else {
      addPage();
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="flex justify-between items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="flex gap-2">
      <button class="button-style" on:click={saveNote}>Save</button>
      <button class="button-style delete-button" on:click={deleteNote}>Delete</button>
    </div>
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

  .button-style {
    background: #4A5568;
    color: white;
    padding: 10px 20px;
    border-radius: 0.375rem;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    display: inline-block;
    text-align: center;
  }

  .button-style:hover {
    background: #2D3748;
  }

  .delete-button {
    background: #E53E3E;
  }

  .delete-button:hover {
    background: #C53030;
  }
</style>
