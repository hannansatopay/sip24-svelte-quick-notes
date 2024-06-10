<script>
  import { onMount } from 'svelte';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(() => {
    const request = indexedDB.open("notesDB", 1);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      const objectStore = db.createObjectStore("notes", { keyPath: "title" });
      objectStore.createIndex("title", "title", { unique: true });
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      loadPages();
    };

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.errorCode);
    };
  });

  function loadPages() {
    const transaction = db.transaction(["notes"], "readonly");
    const objectStore = transaction.objectStore("notes");
    const pagesRequest = objectStore.getAllKeys();

    pagesRequest.onsuccess = (event) => {
      pages = event.target.result;
      if (pages.length > 0) {
        currentPageIndex = 0;
        title = pages[currentPageIndex];
        loadNote();
      } else {
        addPage();
      }
    };
  }

  function loadNote() {
    const transaction = db.transaction(["notes"], "readonly");
    const objectStore = transaction.objectStore("notes");
    const noteRequest = objectStore.get(title);

    noteRequest.onsuccess = (event) => {
      note = event.target.result ? event.target.result.content : '';
    };
  }

  function saveNote() {
    const transaction = db.transaction(["notes"], "readwrite");
    const objectStore = transaction.objectStore("notes");
    const storedPageName = pages[currentPageIndex];

    if (storedPageName !== title) {
      objectStore.delete(storedPageName);
      pages[currentPageIndex] = title;
    }

    const noteData = { title: title, content: note };
    objectStore.put(noteData);

    transaction.oncomplete = () => {
      loadPages();
    };
  }

  function addPage() {
    const newPageTitle = `New Page ${pages.length + 1}`;
    pages.push(newPageTitle);
    currentPageIndex = pages.length - 1;
    title = newPageTitle;
    note = '';

    const transaction = db.transaction(["notes"], "readwrite");
    const objectStore = transaction.objectStore("notes");
    objectStore.put({ title: newPageTitle, content: '' });

    transaction.oncomplete = () => {
      loadPages();
    };
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    loadNote();
  }

  function deletePage(index) {
    const pageTitle = pages[index];
    const transaction = db.transaction(["notes"], "readwrite");
    const objectStore = transaction.objectStore("notes");
    objectStore.delete(pageTitle);

    pages.splice(index, 1);

    transaction.oncomplete = () => {
      if (pages.length === 0) {
        addPage();
      } else if (index === currentPageIndex) {
        currentPageIndex = Math.max(0, currentPageIndex - 1);
        selectPage(currentPageIndex);
      } else if (index < currentPageIndex) {
        currentPageIndex--;
      }
      loadPages();
    };
  }
</script>

<nav class="bg-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <div class="hidden md:block">
          <h1 class="text-white text-lg font-bold">Quick Notes</h1>
        </div>
      </div>
    </div>
  </div>
</nav>

<aside class="fixed top-35 left-0 z-40 w-60 h-screen bg-gray-200">
  <div class="p-4">
    <h2 class="text-lg font-semibold mb-2">Pages</h2>
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <div class="flex justify-between items-center">
            <button 
              on:click={() => selectPage(index)} 
              class="{index === currentPageIndex ? 'bg-gray-300 text-gray-800' : 'text-gray-700 hover:bg-gray-300'} px-3 py-2 rounded-md text-sm font-medium w-full text-left"
            >
              {page}
            </button>
            <button 
              on:click={() => deletePage(index)} 
              class="bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none"
            >
              Delete
            </button>
          </div>
        </li>
      {/each}
      <li>
        <button 
          on:click={addPage} 
          class="bg-gray-300 text-gray-800 hover:bg-gray-400 px-3 py-2 rounded-md text-sm font-medium w-full text-left"
        >
          + Add Page
        </button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr />
  <textarea class="mt-3 block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  
  nav {
    background-color: #4a5568; 
    color: #ffffff
  }

  
  aside {
    background-color: #edf2f7; 
    border-right: 1px solid #e2e8f0; 
  }

  
  main {
    padding: 1rem; 
  }
</style>
