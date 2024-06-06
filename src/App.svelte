<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let db;

  onMount(() => {
    // Open the IndexedDB database
    const request = window.indexedDB.open('notes', 1);

    request.onerror = function(event) {
      console.error('Database error: ' + event.target.errorCode);
    };

    request.onsuccess = function(event) {
      db = event.target.result;
      loadPages();
    };

    request.onupgradeneeded = function(event) {
      db = event.target.result;
      db.createObjectStore('pages', { keyPath: 'id' });
    };
  });

  function loadPages() {
    const transaction = db.transaction(['pages'], 'readonly');
    const objectStore = transaction.objectStore('pages');
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
      pages = event.target.result.map(page => page.title);
      selectPage(currentPageIndex);
    };
  }

  function saveNote() {
    const transaction = db.transaction(['pages'], 'readwrite');
    const objectStore = transaction.objectStore('pages');

    const page = { id: title, title, note };
    const request = objectStore.put(page);

    request.onsuccess = function(event) {
      console.log('Note saved successfully');
    };

    transaction.oncomplete = function(event) {
      console.log('Transaction completed');
    };
  }

  function addPage() {
    const newPageIndex = pages.length;
    const newTitle = `New Page ${newPageIndex + 1}`;
    const transaction = db.transaction(['pages'], 'readwrite');
    const objectStore = transaction.objectStore('pages');

    const page = { id: newTitle, title: newTitle, note: '' };
    const request = objectStore.add(page);

    request.onsuccess = function(event) {
      pages.push(newTitle);
      selectPage(newPageIndex);
    };
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];

    const transaction = db.transaction(['pages'], 'readonly');
    const objectStore = transaction.objectStore('pages');
    const request = objectStore.get(title);

    request.onsuccess = function(event) {
      const page = event.target.result;
      if (page) {
        note = page.note;
      } else {
        note = '';
      }
    };
  }

  function deletePage(index) {
    const pageToDelete = pages[index];
    if (confirm(`Are you sure you want to delete "${pageToDelete}"?`)) {
      const transaction = db.transaction(['pages'], 'readwrite');
      const objectStore = transaction.objectStore('pages');
      const request = objectStore.delete(pageToDelete);

      request.onsuccess = function(event) {
        pages.splice(index, 1);
        if (currentPageIndex >= pages.length) {
          currentPageIndex = pages.length - 1;
        }
        loadPages();
      };
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} bg-dark-gray py-2 px-3 text-gray-900 rounded-lg">{page}</button>
          <button on:click={() => deletePage(index)} class="bg-red-500 text-white px-2 py-1 rounded-lg ml-2">Delete</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add page</button>
      </li>
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