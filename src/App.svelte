<script>
  import { onMount } from 'svelte';

  let db;
  let pages = [];
  let pageIndex = 0;
  let title = '';
  let note = '';
  let visibility = 'hidden';
  let visible = 'hidden';
  let deletep = 'inline';

  function openDatabase() {
    const request = indexedDB.open('noteApp', 1);

    request.onupgradeneeded = function(event) {
      db = event.target.result;
      const objectStore = db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
      objectStore.createIndex('title', 'title', { unique: true });
      objectStore.createIndex('note', 'note', { unique: false });
    };

    request.onsuccess = function(event) {
      db = event.target.result;
      loadPages();
    };

    request.onerror = function(event) {
      console.error('Database error:', event.target.errorCode);
    };
  }

  function loadPages() {
    const transaction = db.transaction(['pages'], 'readonly');
    const objectStore = transaction.objectStore('pages');
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
      pages = event.target.result.map(page => page.title);
      if (pages.length > 0) {
        title = pages[pageIndex] || '';
        loadNote();
      }
    };

    request.onerror = function(event) {
      console.error('Error loading pages:', event.target.errorCode);
    };
  }


  function loadNote() {
    const transaction = db.transaction(['pages'], 'readonly');
    const objectStore = transaction.objectStore('pages');
    const request = objectStore.index('title').get(title);

    request.onsuccess = function(event) {
      const data = event.target.result;
      note = data ? data.note : '';
    };

    request.onerror = function(event) {
      console.error('Error loading note:', event.target.errorCode);
    };
  }


  function addPage() {
    title = 'New note';
    note = '';
    visibility = 'hidden';
    visible = 'hidden';
    deletep = 'inline';
  }


  function saveNote() {
    const transaction = db.transaction(['pages'], 'readwrite');
    const objectStore = transaction.objectStore('pages');
    const request = objectStore.index('title').get(title);

    request.onsuccess = function(event) {
      const data = event.target.result;
      if (data) {
        data.note = note;
        objectStore.put(data);
      } else {
        objectStore.add({ title, note });
      }
      if (!pages.includes(title)) {
        pages.push(title);
        pageIndex = pages.length - 1;
      }
      loadPages(); 
    };

    request.onerror = function(event) {
      console.error('Error saving note:', event.target.errorCode);
    };
  }


  function deletePage(index) {
    const pageToDelete = pages[index];
    const transaction = db.transaction(['pages'], 'readwrite');
    const objectStore = transaction.objectStore('pages');
    const request = objectStore.index('title').get(pageToDelete);

    request.onsuccess = function(event) {
      const data = event.target.result;
      if (data) {
        objectStore.delete(data.id);
      }
      pages.splice(index, 1);
      if (pages.length > 0) {
        if (pageIndex >= index) {
          pageIndex = pageIndex > 0 ? pageIndex - 1 : 0;
        }
        selectPage(pageIndex);
      } else {
        title = '';
        note = '';
        pageIndex = 0;
        visibility = 'hidden';
        visible = 'hidden';
        deletep = 'hidden';
      }
      loadPages(); 
    };

    request.onerror = function(event) {
      console.error('Error deleting page:', event.target.errorCode);
    };
  }

 
  function selectPage(index) {
    pageIndex = index;
    title = pages[pageIndex];
    loadNote();
  }

  
  function setValues() {
    deletep = 'inline';
    if (title !== 'New note') {
      visibility = 'inline';
      visible = 'hidden';
      saveNote();
    } else {
      visible = 'inline';
    }
  }

  
  function hideDiv() {
    visibility = 'hidden';
  }

  onMount(() => {
    openDatabase();
  });
</script>

<aside class="fixed left-0 top-0 z-40 w-60 h-screen">
  <div class="overflow-y-auto bg-light-gray h-full py-5 px-3 border-r-2 border-cyan-200 bg-slate-400">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="grid grid-cols-2 {deletep}">
          <button on:click={() => { selectPage(index); hideDiv(); }} class="text-gray-900 py-2 px-3 {index === pageIndex ? 'bg-gray-200' : ''} rounded-lg">{page}</button>
          <button on:click={() => { deletePage(index); hideDiv(); }} class="ml-2 text-red-500">Delete</button>
        </li>
      {/each}
      <li class="text-center"><button class="font-medium" on:click={() => { addPage(); hideDiv(); }}> + Add Page </button></li>
    </ul>
  </div>
</aside>

<main class="h-screen flex justify-center items-center bg-gradient-to-br from-red-600 to-slate-600">
  <div class="w-1/3 h-5/6 flex flex-col rounded-xl p-5 border border-b-2 border-cyan-300 bg-transparent ml-60">
    <div class="grid grid-cols-2 items-center mt-3 py-2.5 px-5">
      <h1 id="inputid" class="font-bold text-4xl" on:click={hideDiv} contenteditable bind:textContent={title}></h1>
      <button on:click={setValues} class="bg-slate-900 ml-auto text-white rounded-lg px-3 py-1 text-lg hover:bg-slate-800">Save</button>
    </div>
    <hr />
    <textarea on:click={hideDiv} class="py-2.5 px-5 block w-full rounded-lg mb-2 mt-7 text-lg border border-cyan-300 bg-gray-200 text-gray-900" bind:value={note} placeholder="Type here...."></textarea>
    <div class="w-full h-16 mt-10 text-center {visibility}">
      <h1 class="mt-5 text-lg text-white">Note Saved Successfully...</h1>
    </div>
    <div class="w-full h-16 mt-10 text-center {visible}">
      <h1 class="mt-5 text-lg text-red-700">Type Something!!</h1>
    </div>
  </div>
</main>

<style>
  .bg-light-gray {
    background-color: ghostwhite;
  }
</style>
