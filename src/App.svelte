
<script>
  import { onMount } from 'svelte';
  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  const dbName = "notesApp";
  const storeName = "notes";

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onerror = (event) => reject(event.target.error);
      request.onsuccess = (event) => resolve(event.target.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "title" });
        }
      };
    });
  }

  function getItem(key) {
    return openDB().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        request.onerror = (event) => reject(event.target.error);
        request.onsuccess = (event) => resolve(request.result ? request.result.value : "");
      });
    }).catch(error => console.error("Error getting item:", error));
  }

  function setItem(key, value) {
    return openDB().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.put({ title: key, value });
        request.onerror = (event) => reject(event.target.error);
        request.onsuccess = (event) => resolve();
      });
    }).catch(error => console.error("Error setting item:", error));
  }

  function removeItem(key) {
    return openDB().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);
        request.onerror = (event) => reject(event.target.error);
        request.onsuccess = (event) => resolve();
      });
    }).catch(error => console.error("Error removing item:", error));
  }

  function getAllKeys() {
    return openDB().then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.getAllKeys();
        request.onerror = (event) => reject(event.target.error);
        request.onsuccess = (event) => resolve(request.result);
      });
    }).catch(error => console.error("Error getting all keys:", error));
  }

  onMount(async () => {
    try {
      const savedPages = await getAllKeys();
      if (savedPages && savedPages.length > 0) {
        pages = savedPages;
        title = pages[currentPageIndex];
        note = await getItem(title);
      } else {
        addPage();
      }
    } catch (error) {
      console.error("Error in onMount:", error);
    }
  });

  async function saveNote() {
    try {
      const storedPageName = pages[currentPageIndex];
      if (storedPageName != title) {
        await removeItem(storedPageName);
        pages[currentPageIndex] = title;
      }
      await setItem(title, note);
      addPage()
    } catch (error) {
      console.error("Error saving note:", error);
    }
  }

  function addPage() {
     if (!pages.includes("New Page")) {
      pages.push("New Page");
      selectPage(pages.length - 1);
    }
  }
    
  
  async function selectPage(index) {
    try {
      currentPageIndex = index;
      title = pages[index] || "New Page";
      note = await getItem(title);
    } catch (error) {
      console.error("Error selecting page:", error);
    }
  }

  async function rem(currentPageIndex) {
    try {
      const storedPageName = pages[currentPageIndex];
      pages = pages.filter(page => page !== storedPageName);
      await removeItem(storedPageName);
      selectPage(pages.length ? pages.length - 1 : 0);
    } catch (error) {
      console.error("Error removing page:", error);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button class="{ index == currentPageIndex ? 'bg-dark-gray' : '' } py-2 px-3 text-gray-900 rounded-lg" on:click={() => selectPage(index)}>{page}</button>
      </li>
      {/each}
      <li class="text-center">
        <button class="font-medium" on:click={addPage}> + Add page </button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable="true" bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  <button class="py-2 px-3 text-gray-900 rounded-lg bg-red-600 text-white mt-3" on:click={()=>{rem((currentPageIndex))}}>DELETE</button></main>

<style>
  .bg-light-gray {
    background: #fbfbff;
  }
  .bg-dark-gray {
    background: #efefef;
  }
</style>