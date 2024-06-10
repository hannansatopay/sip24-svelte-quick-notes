<script>
  import { onMount } from "svelte";

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let tittle = '';
  let note = '';

  onMount(() => {
    const request = indexedDB.open("notes_db", 1);

    request.onerror = function(event) {
      // @ts-ignore
      console.error("Database error: " + event.target.errorCode);
    };

    request.onupgradeneeded = function(event) {
      // @ts-ignore
      db = event.target.result;
      const objectStore = db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
      objectStore.createIndex("title", "title", { unique: false });
      objectStore.createIndex("note", "note", { unique: false });
    };

    request.onsuccess = function(event) {
      // @ts-ignore
      db = event.target.result;
      readPages();
    };
  });

  function readPages() {
    const transaction = db.transaction(["notes"], "readonly");
    const objectStore = transaction.objectStore("notes");
    const getAllPagesRequest = objectStore.getAll();

    getAllPagesRequest.onsuccess = function(event) {
      pages = event.target.result;
      if (pages.length > 0) {
        selectPage(0);
      } else {
        addPage();
      }
    };

    getAllPagesRequest.onerror = function(event) {
      console.error("Error reading pages: " + event.target.errorCode);
    };
  }

  function saveNote() {
    const transaction = db.transaction(["notes"], "readwrite");
    const objectStore = transaction.objectStore("notes");
    const request = objectStore.put({ title: tittle, note: note });

    // @ts-ignore
    request.onsuccess = function(event) {
      readPages();
    };

    request.onerror = function(event) {
      console.error("Error saving note: " + event.target.errorCode);
    };
  }

  function addPage() {
    const defaultPage = { title: "New Page", note: "" };
    const transaction = db.transaction(["notes"], "readwrite");
    const objectStore = transaction.objectStore("notes");
    const request = objectStore.add(defaultPage);

    // @ts-ignore
    request.onsuccess = function(event) {
      readPages();
    };

    request.onerror = function(event) {
      console.error("Error adding page: " + event.target.errorCode);
    };
  }

  function selectPage(index){
    currentPageIndex = index;
    tittle = pages[currentPageIndex].title;
    note = pages[currentPageIndex].note;
  }

  function deletePage(index) {
    const transaction = db.transaction(["notes"], "readwrite");
    const objectStore = transaction.objectStore("notes");
    const request = objectStore.delete(pages[index].id);

    // @ts-ignore
    request.onsuccess = function(event) {
      readPages();
    };

    request.onerror = function(event) {
      console.error("Error deleting page: " + event.target.errorCode);
    };
  }
</script>


<aside class="fixed top-0 left-0 z-40 h-screen w-64 bg-gray-800 overflow-y-auto py-5 px-3 border-r border-gray-700">
  <div class="space-y-2">
    {#each pages as page, index}
      <div class="flex items-center justify-between">
        <button on:click={()=>selectPage(index)} class="block w-full text-left py-2 px-3 rounded-lg transition duration-200 {index == currentPageIndex ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-gray-700'}">
          {page.title} <!-- Display the title of the page -->
        </button>
        <button on:click={()=>deletePage(index)} class="text-red-500 hover:text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M6 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a1 1 0 0 1 1 1v1H5V4a1 1 0 0 1 1-1zm2 2h6V4H8v1zM5 7h10v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7zm7-2V4h2v1h-2z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    {/each}
    <button on:click={addPage} class="block w-full py-2 px-3 text-center text-gray-300 rounded-lg transition duration-200 hover:bg-gray-700 font-medium">+ Add Page</button>
  </div>
</aside>


<main class="p-8 ml-64 h-auto bg-gray-100 min-h-screen bg-yellow-500">
  <div class="flex items-center mb-3">
    <h1 contenteditable bind:textContent={tittle} class="text-3xl font-bold border-b-2 border-gray-300 pb-2 flex-grow">{tittle}</h1>
    <button on:click={saveNote} class="ml-4 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-blue-700 transition duration-200">Save</button>
  </div>
  <hr class="mb-4" />
  <textarea bind:value={note} class="block w-full bg-white border border-gray-300 rounded-lg text-gray-900 p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none min-h-[400px]"></textarea>
</main>

<style>
  .bg-gray-800 {
    background: #1a202c;
  }
  .bg-blue-500 {
    background: #4299e1;
  }
  .bg-blue-600 {
    background: #3182ce;
  }
</style>
