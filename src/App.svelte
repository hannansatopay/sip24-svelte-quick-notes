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
          db.createObjectStore('notes', { keyPath: 'title' });
          db.createObjectStore('pages', { keyPath: 'index' });
        }
      });
  
      const savedPages = await db.getAll('pages');
      pages = savedPages.map(page => page.title);
  
      if (pages.length > 0) {
        selectPage(0);
      } else {
        addPage();
      }
    });
  
    async function saveNote() {
      if (title.trim()) {
        pages[currentPageIndex] = title;
        await db.put('notes', { title, note });
        await db.put('pages', { index: currentPageIndex, title });
      } else {
        alert('Title cannot be empty');
      }
    }
  
    async function addPage() {
      const newPageTitle = `New Page ${pages.length + 1}`;
      pages.push(newPageTitle);
      selectPage(pages.length - 1);
      await saveNote();
    }
  
    async function selectPage(index) {
      currentPageIndex = index;
      title = pages[currentPageIndex];
      const savedNote = await db.get('notes', title);
      note = savedNote ? savedNote.note : '';
    }
  
    async function deletePage(index) {
      const pageTitle = pages[index];
      pages.splice(index, 1);
  
      for (let i = index; i < pages.length; i++) {
        await db.put('pages', { index: i, title: pages[i] });
      }
  
      await db.delete('notes', pageTitle);
      await db.delete('pages', pages.length);
  
      if (pages.length > 0) {
        selectPage(0);
      } else {
        addPage();
      }
    }
  </script>
  
  <aside class="fixed top-0 left-0 z-40 w-60 h-screen">
    <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
      <ul class="space-y-2">
        {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="bg-dark-gray py-2 px-3 text-gray-900 rounded-lg">
            {page}
          </button>
          <button on:click={() => deletePage(index)} class="text-red-500 ml-2">🗑️</button>
        </li>
        {/each}
        <li class="text-center">
          <button on:click={addPage} class="font-medium">+ Add Page</button>
        </li>
      </ul>
    </div>
  </aside>
  
  <main class="p-4 ml-60 h-auto">
    <div class="grid grid-cols-2 items-center mb-3">
      <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
      <button
        class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900"
        on:click={saveNote}
      >
        Save
      </button>
    </div>
    <hr />
    <textarea
      class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
      bind:value={note}
    ></textarea>
  </main>
  
  <style>
    .bg-light-gray {
      background: #FBFBFB;
    }
  
    .bg-dark-gray {
      background: #EFEFEF;
    }
  </style>
  