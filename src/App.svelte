<script>
 
  import { onMount } from 'svelte';
  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';


  const dbName = "sticky_note";
  const storeName = 'store_sticky_notes';


  onMount(() => {
    const openRequest = indexedDB.open(dbName);

    openRequest.onupgradeneeded = function() {
      db = openRequest.result;

      // conditions

      if (!db.objectStoreNames.contains(storeName)) {

        // on upgrade needed
        db.createObjectStore(storeName, { keyPath: 'title' });
      }
    }

    openRequest.onsuccess = function() {

      // on Success
      db = openRequest.result;

      live_note();
    }
  });

  function live_note() {
    const transaction = db.transaction(storeName, 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.getAllKeys();
    
    request.onsuccess = function() {

      pages = request.result;
      if (pages.length > 0) {
        selectPage(currentPageIndex);
      } 
      else {
        addPage();
      }
    }
  }

  function saveNote() {

    const transaction = db.transaction(storeName, 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const storedPageName = pages[currentPageIndex];
    
    if (storedPageName != title) {

      objectStore.delete(storedPageName);
      pages[currentPageIndex] = title;

    }

    objectStore.put({ title, note });
    localStorage.setItem("pages", JSON.stringify(pages));

  }

  function addPage() {

    const newTitle = "New Page";
    pages.push(newTitle);
    selectPage(pages.length - 1);
    saveNote();

  }


  function selectPage(index) {

    currentPageIndex = index;

    title = pages[currentPageIndex];

    const transaction = db.transaction(storeName, 'readonly');
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(title);
    request.onsuccess = function() {

      const result = request.result;
      
      if (result) {
        note = result.note;
      } else {
        note = '';
      }
    }
  }

  function deletePage(index) {

    if (pages.length === 1) {
      alert('Cannot delete the only page.');
      return;
    }

    const deletedPage = pages.splice(index, 1)[0];
    const transaction = db.transaction(storeName, 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    objectStore.delete(deletedPage);

    localStorage.setItem('pages', JSON.stringify(pages));
    
    if (index === currentPageIndex) {
      currentPageIndex = Math.max(0, index - 1);
    }
    selectPage(currentPageIndex);
  }
  function deleteNote() {
  const transaction = db.transaction(storeName, 'readwrite');
  const objectStore = transaction.objectStore(storeName);
  const deleteRequest = objectStore.delete(title);
  deleteRequest.onsuccess = function() {
    note = '';
  };
}
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">
            {page}
          </button>
          <button on:click={() => deletePage(index)} class="ml-2 text-gray-500">❌</button>
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
    <button class="mt-3 ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>

  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  <button class="mt-3 ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900" on:click={deleteNote}>Delete 🗑️ </button>
</main>

<style>

  .bg-light-gray {
  background: #FBFBFB;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>