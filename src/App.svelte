<!-- code for the Note App with indexedDB -->

<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  const dbName = 'noteApp';
  const dbVersion = 1;
  let db;

  const request = indexedDB.open(dbName, dbVersion);

  request.onupgradeneeded = function(event) {
    db = event.target.result;

    if (!db.objectStoreNames.contains('pages')) {
      db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
    }
  };

  request.onsuccess = function(event) {
    db = event.target.result;
    loadPages();
  };

  request.onerror = function(event) {
    console.error('Error opening IndexedDB', event);
  };

  function loadPages() {
    const transaction = db.transaction(['pages'], 'readonly');
    const store = transaction.objectStore('pages');
    const request = store.getAll();

    request.onsuccess = function(event) {
      pages = event.target.result;
      if (pages.length > 0) {
        selectPage(0);
      } else {
        addPage();
      }
    };

    request.onerror = function(event) {
      console.error('Error loading pages from IndexedDB', event);
    };
  }

  function saveNote() {
    const transaction = db.transaction(['pages'], 'readwrite');
    const store = transaction.objectStore('pages');

    const updatedPage = { ...pages[currentPageIndex], title, note };
    const request = store.put(updatedPage);

    request.onsuccess = function(event) {
      pages[currentPageIndex] = updatedPage;
      console.log('Note saved successfully');
    };

    request.onerror = function(event) {
      console.error('Error saving note', event);
    };
  }

  function addPage() {
    const transaction = db.transaction(['pages'], 'readwrite');
    const store = transaction.objectStore('pages');

    const newPage = { title: 'New Page', note: '' };
    const request = store.add(newPage);

    request.onsuccess = function(event) {
      pages.push({ ...newPage, id: event.target.result });
      pages = [...pages];
      selectPage(pages.length - 1);
    };

    request.onerror = function(event) {
      console.error('Error adding new page', event);
    };
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].note;
  }

  function deleteNote() {
    const transaction = db.transaction(['pages'], 'readwrite');
    const store = transaction.objectStore('pages');

    const pageToDelete = pages[currentPageIndex];
    const request = store.delete(pageToDelete.id);

    request.onsuccess = function(event) {
      pages.splice(currentPageIndex, 1);
      if (pages.length > 0) {
        selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
      } else {
        addPage();
      }
    };

    request.onerror = function(event) {
      console.error('Error deleting note', event);
    };
  }

  onMount(loadPages);
</script>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-1 sm:grid-cols-5 items-center mb-3">
    <h1 class="sm:col-span-3 text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="sm:col-span- mt-3 sm:mt-0 sm:ml-auto sm:col-start-4 sm:col-end-6 flex justify-start">
      <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mr-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
      <button class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-700" on:click={deleteNote}>Delete</button>
    </div>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>



<!-- code for Note App with Local Storage -->

<!-- <script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    } else {
      addPage();
    }
  });

  function saveNote() {   
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }

  function deleteNote() {
    const pageTitle = pages[currentPageIndex];
    localStorage.removeItem(pageTitle);
    pages.splice(currentPageIndex, 1);
    if (pages.length > 0) {
      selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
    } else {
      addPage();
    }
    localStorage.setItem("pages", JSON.stringify(pages));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
<div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
  <ul class="space-y-2">
    {#each pages as page, index}
    <li>
        <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
    </li>
    {/each}
    <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
  </ul>
</div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-5 items-center mb-3">
    <h1 class="col-span-3 text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="col-span-1 ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
    <button class="col-span-1 ml-auto bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700" on:click={deleteNote}>Delete</button>
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
</style> -->

