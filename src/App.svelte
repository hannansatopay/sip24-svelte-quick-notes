
<script>
  import { onMount } from "svelte";
  import Dexie from 'dexie';

  // Initialize Dexie database
  const db = new Dexie('TodoDatabase');
  db.version(1).stores({
    pages: '++id, title, note' 
  });

  // Variable declaration
  let pages = [];
  let currentPageIndex = null; 
  let currentPageId = null; 
  let title = "";
  let note = "";
  let addingNewPage = false;

  // Fetch notes
  onMount(async () => {
    // @ts-ignore
    const savedPages = await db.pages.toArray();
    if (savedPages.length) {
      pages = savedPages.map(page => page.title);
    }
  });

  //saving note 
  async function saveNote() {
    if (title.trim() === "") return;
    if (currentPageId !== null) {
      // @ts-ignore
      await db.pages.update(currentPageId, { title, note });
    } else {
      // @ts-ignore
      await db.pages.put({ title, note });
    }
    // @ts-ignore
    const savedPages = await db.pages.toArray();
    pages = savedPages.map(page => page.title);
    title = "";
    note = "";
    currentPageId = null;
    addingNewPage = false; 
  }

  // Create a new page
  function addPage() {
    title = "New Page";
    note = "";
    currentPageId = null;
    addingNewPage = true; 
  }

  // Select a page
  async function selectPage(index) {
    currentPageIndex = index;
    const pageTitle = pages[currentPageIndex];
    if (pageTitle) { 
      // @ts-ignore
      const pageData = await db.pages.where('title').equals(pageTitle).first();
      if (pageData) {
        title = pageData.title;
        note = pageData.note;
        currentPageId = pageData.id; 
      } else {
        title = "";
        note = "";
        currentPageId = null;
      }
    } else {
      title = "";
      note = "";
      currentPageId = null;
    }
  }
// Remove a page
async function removePage(index) {
    const pageTitle = pages[index];
    // @ts-ignore
    await db.pages.where('title').equals(pageTitle).delete();
    // Remove page 
    pages.splice(index, 1);
    title = "";
    note = "";
    currentPageId = null;
    if (pages.length === 0) {
      addPage();
    } else {
      currentPageIndex = null; 
    }
    location.reload();
}

</script>


<div class="flex justify-center items-center h-screen">
  <div class="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg sm:p-8">
      <div class="flex flex-col md:flex-row items-start md:items-center md:space-x-4">
        <div class="flex-1 min-w-0">
          <!-- for title  -->
          <h5>Add Title</h5>

          <div class="block w-full bg-gray-100 border border-gray-400 rounded-lg p-3 mb-4">
            <h1
              class="text-3xl font-semibold w-full outline-none"
              contenteditable
              bind:textContent={title}
              style="border: 1px solid transparent;" 
            ></h1>
          </div>
          
          <!-- for note  -->
          <h5>Add Note</h5>

          <textarea
            bind:value={note}
            class="block w-full bg-gray-100 border border-gray-400 rounded-lg p-3 mb-4"
          ></textarea>
          <!-- submit button  -->
          <button
            class="w-full bg-gray-800 text-white p-5 rounded-lg font-semibold text-1xl hover:bg-gray-900"
            on:click={saveNote}
          >
            Save
          </button>
        </div>
    </div>
  </div>


<aside class="fixed top-0 left-0 z-40 w-80 h-screen md:w-100 lg:w-60">
  <div class="bg-style overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex items-center justify-between"> <!-- Added flex and justify-between -->
          <button on:click={()=>selectPage(index)} class="{index === currentPageIndex ? 'bg-red-200 text-black' : ''} text-black py-2 px-3 rounded-lg w-36">
            {page}
          </button>
          <button on:click={() => removePage(index)} class="bg-red-500 text-white font-medium w-36 py-2 px-3 rounded-lg ml-2">
            Remove
          </button>
        </li>
      {/each}
      <li class="text-center p-2 mt-3">
        <button on:click={addPage} class="text-black font-bold">
          +Add page
        </button>
      </li>
    </ul>
  </div>
  
</aside>

</div>

<style>
  .bg-style {
    background: rgb(241, 240, 240);
  }
</style>
