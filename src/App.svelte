
<script>
  import { onMount } from "svelte";
  import { openDB } from 'idb';

  let title = '';
  let note = '';
  let pages = [];
  let currentPage = 0;
  let db;

  onMount(async () => {
    db = await openDB('NotesDB', 1, {
      upgrade(db) {
        db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('notes');
      },
    });

    const savedPages = await db.getAll('pages');
    if (savedPages.length) {
      pages = savedPages.map(page => page.title);
      title = pages[currentPage];
      note = await db.get('notes', title) || '';
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const page = { id: currentPage + 1, title };
    await db.put('pages', page);
    await db.put('notes', note, title);
    pages[currentPage] = title;
  }

  async function addPage() {
    const newPage = { id: pages.length + 1, title: "New Page" };
    await db.add('pages', newPage);
    pages.push(newPage.title);
    currentPage = pages.length - 1;
    title = newPage.title;
    note = '';
  }

  async function selectPage(index) {
    currentPage = index;
    title = pages[currentPage];
    note = await db.get('notes', title) || '';
  }

  async function deletePage(index) {
    const pageTitle = pages[index];
    pages.splice(index, 1);
    await db.delete('notes', pageTitle);
    const allPages = await db.getAll('pages');
    const pageId = allPages.find(page => page.title === pageTitle).id;
    await db.delete('pages', pageId);

    if (currentPage >= pages.length) {
      currentPage = pages.length - 1;
    }
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(currentPage);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-50 w-64 h-screen text-white bg-gray-800 shadow-lg md:w-80 lg:w-96">
  <div class="flex flex-col gap-4 p-5 rounded-lg">
    <div class="flex flex-col gap-4">
      {#each pages as page, index}
        <div class="flex items-center justify-between">
          <button 
            on:click={() => selectPage(index)} 
            class="flex items-center justify-center w-[240px] px-3 py-2 text-white transition duration-300 rounded-lg hover:bg-gray-500 {currentPage === index ? 'bg-blue-600' : 'bg-gray-600'}"
          >
            {page}
          </button>
          {#if currentPage === index}
            <button 
              on:click={() => deletePage(index)} 
              class="flex items-center justify-center w-8 h-8 text-white transition duration-300 bg-red-600 rounded-full"
            >
            <svg height='24' width='24' xmlns="http://www.w3.org/2000/svg" id="Delete" x="0" y="0" version="1.1" viewBox="0 0 29 29" xml:space="preserve"><path d="M10 3v3h9V3a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1z" fill="#ffffff" class="color000000 svgShape"></path><path d="M4 5v1h21V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1zM6 8l1.812 17.209A2 2 0 0 0 9.801 27H19.2a2 2 0 0 0 1.989-1.791L23 8H6zm4.577 16.997a.999.999 0 0 1-1.074-.92l-1-13a1 1 0 0 1 .92-1.074.989.989 0 0 1 1.074.92l1 13a1 1 0 0 1-.92 1.074zM15.5 24a1 1 0 0 1-2 0V11a1 1 0 0 1 2 0v13zm3.997.077a.999.999 0 1 1-1.994-.154l1-13a.985.985 0 0 1 1.074-.92 1 1 0 0 1 .92 1.074l-1 13z" fill="#ffffff" class="color000000 svgShape"></path></svg>
            </button>
          {/if}
        </div>
      {/each}
      <button 
        on:click={addPage} 
        class="py-3 text-white transition duration-300 bg-green-600 rounded-lg hover:bg-green-500"
      >
        + Add Page
      </button>
    </div>
  </div>
</aside>

<main class="p-4 ml-64 md:ml-80 lg:ml-96">
  <div class="flex flex-col items-center justify-start rounded-lg">
    <div class="flex flex-col w-full gap-4 p-5 bg-white rounded-lg shadow-lg">
      <div class="flex items-center justify-between w-full">
        <h1 
          contenteditable="true" 
          bind:innerText={title} 
          class="text-2xl font-semibold text-gray-800 transition duration-300 border-b-2 border-gray-300 focus:border-blue-500"
        >
          {title || "New Page"}
        </h1>
        <span>
          <button 
            class="px-4 py-2 font-medium text-white transition duration-300 bg-blue-600 rounded-md hover:bg-blue-500" 
            on:click={saveNote}
          >
            Save
          </button>
        </span>
      </div>
      <textarea 
        placeholder="Add Note" 
        class="w-full p-2 transition duration-300 border-2 border-gray-300 rounded-md focus:border-blue-500" 
        bind:value={note}
      ></textarea>
    </div>
  </div>
</main>
//responsive to the screen size
<style>
  @media (max-width: 640px) {
    aside {
      width: 100%;
      height: auto;
      position: relative;
    }
    main {
      margin-left: 0;
      padding-top: 20px;
    }
  }
</style>