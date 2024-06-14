<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb'; // Use idb for IndexedDB

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let db;

  function initDB() {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
      }
    });
  }

  function loadNotes() {
    const allNotes = await db.getAll('notes');
    if (allNotes.length) {
      pages = allNotes.map(note => note.title);
      title = pages[currentPageIndex];
      note = (await db.get('notes', title)).content;
    } else {
      addPage();
    }
  }

  onMount(async () => {
    await initDB();
    await loadNotes();
  });

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex] = title;
    }
    await db.put('notes', { title, content: note });
    await db.put('notes', { title: 'pages', content: JSON.stringify(pages) });
  }

  function addPage() {
    pages.push("New Page");
    await saveNote();
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  function deletePage(index) {
    const pageTitle = pages[index];
    await db.delete('notes', pageTitle);
    pages.splice(index, 1);
    if (index === currentPageIndex) {
      currentPageIndex = 0;
      title = pages.length ? pages[0] : '';
      note = pages.length ? (await db.get('notes', title)).content : '';
    }
    await db.put('notes', { title: 'pages', content: JSON.stringify(pages) });
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = (await db.get('notes', title)).content;
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
<div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
  <ul class="space-y-2">
    {#each pages as page, index}
    <li class="flex items-center justify-between">
      <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg flex-grow">{page}</button>
      <button on:click={()=>deletePage(index)} class="ml-2 text-red-600">✕</button>
    </li>
    {/each}
    <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
  </ul>
</div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
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
</style>
