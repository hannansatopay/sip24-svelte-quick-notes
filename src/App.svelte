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

<nav class="bg-blue-600 p-4 shadow-lg">
  <div class="container mx-auto">
    <h1 class="text-white text-2xl font-bold">Quick Notes</h1>
  </div>
</nav>

<div class="flex h-screen">
  <aside class="w-60 bg-gray-100 border-r border-gray-200">
    <div class="overflow-y-auto py-5 px-3 h-full">
      <ul class="space-y-2">
        {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-blue-500 text-white' : ''} py-2 px-3 w-full text-left rounded-lg">{page}</button>
          <button on:click={() => deletePage(index)} class="text-red-600 hover:text-red-800 ml-2">Delete</button>
        </li>
        {/each}
        <li class="text-center">
          <button on:click={addPage} class="font-medium text-blue-600 hover:text-blue-800">+ Add page</button>
        </li>
      </ul>
    </div>
  </aside>

  <main class="flex-1 p-6 bg-gray-50">
    <div class="mb-4">
      <div class="flex items-center">
        <h1 class="text-3xl font-bold border-b-2 border-gray-200 pb-2 flex-grow" contenteditable bind:textContent={title}></h1>
        <button class="ml-4 bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700" on:click={saveNote}>Save</button>
      </div>
      <hr class="my-4" />
      <textarea class="block w-full h-96 bg-white border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-600" bind:value={note}></textarea>
    </div>
  </main>
</div>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
