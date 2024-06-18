<
  <script>
    import { onMount } from 'svelte';
  <<<<<<< aditya-pai
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
  =======
    import { openDB } from 'idb';
  
    let pages = [];
    let currentPageIndex = 0;
    let title = '';
    let note = '';
  
    const dbPromise = openDB('notes-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('pages')) {
          const store = db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
          store.createIndex('title', 'title', { unique: true });
        }
      },
    });
  
    onMount(async () => {
      const db = await dbPromise;
      const allPages = await db.getAll('pages');
      if (allPages.length) {
        pages = allPages;
        selectPage(0);
      } else {
        await addPage();
  >>>>>>> tutorial
      }
    });
  
    async function saveNote() {
  <<<<<<< aditya-pai
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
  =======
      const db = await dbPromise;
      const page = pages[currentPageIndex];
      page.title = title;
      await db.put('pages', page);
      const allPages = await db.getAll('pages');
      pages = allPages;
    }
  
    async function addPage() {
      const db = await dbPromise;
      const newPage = { title: "New Page" };
      const id = await db.add('pages', newPage);
      newPage.id = id;
      pages.push(newPage);
      selectPage(pages.length - 1);
    }
  
    async function selectPage(index) {
      currentPageIndex = index;
      const page = pages[currentPageIndex];
      title = page.title;
      const db = await dbPromise;
      const noteObj = await db.get('pages', page.id); // Corrected to use 'pages' object store
      note = noteObj ? noteObj.note : "";
    }
  
    async function deletePage() {
      if (confirm("Are you sure you want to delete this page?")) {
        const db = await dbPromise;
        const page = pages[currentPageIndex];
        await db.delete('pages', page.id);
        pages.splice(currentPageIndex, 1);
        if (currentPageIndex >= pages.length) {
          selectPage(pages.length - 1);
        }
  >>>>>>> tutorial
      }
    }
  </script>
  
  <<<<<<< aditya-pai
  <aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  =======
  <aside class="fixed top-0 left-0 z-0 w-60 h-screen">
  >>>>>>> tutorial
    <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
      <ul class="space-y-2">
        {#each pages as page, index}
        <li>
  <<<<<<< aditya-pai
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
  =======
          <button on:click={() => selectPage(index)} class="bg-dark-gray py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
        </li>
        {/each}
        <li class="text-center"><button on:click={addPage} class="font-medium text-white">+ Add Page</button></li>
      </ul>
    </div>
  </aside>
  
  <main class="p-4 ml-60 h-auto">
    <div class="grid grid-cols-2 items-center mb-3">
      <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
      <div class="flex justify-end">
        <button on:click={saveNote} class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900">Save</button>
      </div>
    </div>
    <hr/>
    <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  </main>
  
  <style>
    :global(body) {
      background-color: #a9b5e7;
      margin: 0;
      font-family: Arial, sans-serif;
    }
  
    .bg-light-gray {
      background: #fbfbfb;
    }
  
    .bg-dark-gray {
      background: #efefef;
    }
  
    hr {
      top: 20px;
      bottom: 20px;
      height: 2px;
      background: rgb(16, 16, 16);
    }
  </style>
  >>>>>>> tutorial
  