<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let db;

  onMount(() => {
    openDB('notesApp', 1, {
      upgrade(db) {
        db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('notes');
      },
    }).then(database => {
      db = database;
      return db.getAll('pages');
    }).then(savedPages => {
      if (savedPages.length > 0) {
        pages = savedPages.map(page => page.title);
        title = pages[currentPageIndex];
        return db.get('notes', title);
      } else {
        addPage();
      }
    }).then(savedNote => {
      if (savedNote !== undefined) {
        note = savedNote;
      }
    });
  });

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      db.delete('notes', storedPageName).then(() => {
        pages[currentPageIndex] = title;
        return db.put('pages', { id: currentPageIndex + 1, title });
      }).then(() => {
        return db.put('notes', note, title);
      });
    } else {
      db.put('notes', note, title);
    }
  }

  function addPage() {
    const newPageTitle = "New Page";
    pages.push(newPageTitle);
    db.put('pages', { id: pages.length, title: newPageTitle }).then(() => {
      selectPage(pages.length - 1);
    });
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    db.get('notes', title).then(savedNote => {
      note = savedNote;
    });
  }

  function deletePage(index) {
    const pageToDelete = pages[index];
    db.delete('notes', pageToDelete).then(() => {
      return db.delete('pages', index + 1);
    }).then(() => {
      pages.splice(index, 1);
      if (pages.length === 0) {
        title = '';
        note = '';
        currentPageIndex = 0;
      } else {
        currentPageIndex = index > 0 ? index - 1 : 0;
        selectPage(currentPageIndex);
      }
    });
  }
</script>


<aside class="fixed top-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    {#if pages.length > 0}
      <ul class="space-y-2">
        {#each pages as page, index}
          <li class="flex items-center justify-between">
            <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} ml-auto py-2 px-3 text-gray-900 rounded-lg">
              {page}
            </button>
            {#if index === currentPageIndex}
              <button on:click={() => deletePage(index)} class="ml-2 text-red-500 rounded-lg  hover:bg-gray-200">Delete</button>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
    <div class="text-center mt-4">
      <button on:click={addPage} class="font-medium">+Add Page</button>
    </div>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <h1 class="text-4xl font-bold text-center">Quick Notes</h1>
  {#if pages.length > 0}
    <div class="grid grid-cols-2 items-center mb-3">
      <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}>{title || "New Page"}</h1>
      <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
    </div>
    <hr/>
    <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  {/if}
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
