<script>
  import { onMount } from "svelte";
  import "@fortawesome/fontawesome-free/css/all.min.css";

  let name = "Sahran Altaf";
  let title = "";
  let note = "";
  let pages = [];
  let currentPageIndex = 0;

  onMount(() => {
    const SavedPages = localStorage.getItem("pages");
    if (SavedPages) {
      pages = JSON.parse(SavedPages);
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
    selectpage(pages.length ? pages.length - 1 : 0);
  }

  function selectpage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }

  function deletePage(index) {
  const storedPageName = pages[index];
  localStorage.removeItem(storedPageName);  
  pages.splice(index, 1);  
  

  if (index === currentPageIndex) {
    currentPageIndex = index > 0 ? index - 1 : 0;
    title = pages[currentPageIndex] || "";
    note = localStorage.getItem(title) || "";
  } else if (index < currentPageIndex) {
    currentPageIndex -= 1;
  }

  if (pages.length === 0) {
    currentPageIndex = 0;
    title = "";
    note = "";
  } else {
    currentPageIndex = currentPageIndex >= pages.length ? pages.length - 1 : currentPageIndex;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || "";
  }

  localStorage.setItem("pages", JSON.stringify(pages));
}


</script>

<aside class="fixed top-0 left-0 z-40 w-80 h-screen">
  <div
    class="bg-light-gray overflow-y-auto py-4 px-5 h-full border-r border-gray-200"
  >
    <ul class="space-y-2">
      <li class="text-center">
        <button class="font-medium" on:click={addPage}>+ Add Page</button>
      </li>

      {#each pages as page, index}
        <li>
          <button
            on:click={() => selectpage(index)}
            class="{index == currentPageIndex
              ? 'bg-purple-gray'
              : 'bg-red'} py-2 px-3 rounded-lg w-full text-left mb-1"
            >{page}
          </button>
        </li>
      {/each}
    </ul>
  </div>
</aside>
<main class="p-4 ml-80 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1
      class="font-bold text-3xl border rounded-lg p-2"
      contenteditable
      bind:textContent={title}
    ></h1>

    <button class="btn ml-auto" on:click={deletePage}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        class="icon"
      >
        <path
          d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
        />
      </svg>
    </button>
  </div>
  <hr />
  <br />

  <textarea
    class="mt-5 block w-full bg-gray-100 border border-gray-300 rounded-lg p-2.5 text-gray-40"
    bind:value={note}
    placeholder="describe"
  ></textarea>
  <br />
  <button
    class=" ml-auto bg-gray-700 text-white px-5 py-2 rounded-lg mt-3 font-medium hover:bg-gray-900"
    on:click={saveNote}>Save</button
  >
</main>

<style>
  .bg-light-gray {
    background: rgb(243, 240, 240);
  }

  .bg-purple-gray {
    background: darkorchid;
  }
  .bg-red {
    background-color: #cab5f462;
  }
  .btn {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .btn .icon {
    width: 40px;
    height: 30px;
    margin-right: 8px; 
=======
  import { onMount } from 'svelte';
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
    }
  });

  async function saveNote() {
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
    }
  }
</script>

<aside class="fixed top-0 left-0 z-0 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
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
