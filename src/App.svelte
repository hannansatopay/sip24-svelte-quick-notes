<script>
  import {onMount} from 'svelte'
  import Dexie from 'dexie'
  import debounce from 'lodash/debounce'

  let pages = []
  let currentPageIndex = 0
  let title = ''
  let note = ''
  let searchQuery = ''
  let filteredPages = []
  let searchNoteDebounced = debounce(searchNote, 300)

  const db = new Dexie('notesDB');
  db.version(1).stores({
    pages: '++id, title, note',
  });

  onMount(async ()=>{
    const savedPages = await db.pages.toArray()
    if (savedPages.length > 0) {
      pages = savedPages
      title = pages[currentPageIndex].title
      note = pages[currentPageIndex].note
    }else {
      addPage()
    }
  })

  async function saveNote(){
    const storedPage = pages[currentPageIndex]
    await db.pages.put({id: storedPage.id, title, note})
    pages[currentPageIndex] = {id: storedPage.id, title, note}
  }

  async function addPage() {
    const newPage = {title: 'New Page', note: ''}
    const id = await db.pages.add(newPage)
    pages.push({id, ...newPage})
    selectPage(pages.length-1)
  }

  async function selectPage(index){
    currentPageIndex = index
    title = pages[currentPageIndex].title
    note = pages[currentPageIndex].note
  }

  async function deletePage(index){
    const page = pages[index]
    pages.splice(index, 1)
    await db.pages.delete(page.id)

    if (currentPageIndex >= index) {
      currentPageIndex = Math.max(0, currentPageIndex - 1)
    }
    if(pages.length > 0) {
      title = pages[currentPageIndex].title
      note = pages[currentPageIndex].note
    } else {
      title = ''
      note = ''
      addPage() //ensures that a page exists when a new title and note is added without pressing the add page button 
    }
    pages = [...pages] //re-render the pages
  }

  function searchNote(){
    if (searchQuery.trim() === '') {
      filteredPages = [];
      return;
    }

    filteredPages = pages.filter((page) => {
      return page.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }

  function selectSearchedPage(id){
    const index = pages.findIndex(page => page.id ===id)
    selectPage(index)
    filteredPages = []
    searchQuery = ''
  }
</script>

<header>
  <div class="text-2xl text-gray-800 font-bold">NotesApp</div>
  <input on:input={()=>searchNoteDebounced()} type="text" class="search-bar" placeholder="Search notes..." bind:value={searchQuery} />
  {#if filteredPages.length > 0}
    <div class="filtered-pages">
      {#each filteredPages as filteredPage, index}
        <li on:click={() => selectSearchedPage(filteredPage.id)} class="filtered-page">{filteredPage.title}</li>
      {/each}
    </div>
  {/if}
</header>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-gray-200" >
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="grid grid-cols-2 items-center mb-3">
          <button on:click={()=>selectPage(index)} class="{index == currentPageIndex && 'bg-dark-gray'} py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
          <button>
            <svg on:click={()=>deletePage(index)} class="ml-4 my-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...$$props}>
              <path fill="#c03030" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" />
            </svg>
          </button>
        </li>
      {/each}
      <li class="text-center hover:text-gray-800">
        <button class="font-medium" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto">
      <button class="bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-800" on:click={deletePage(currentPageIndex)}>Delete</button>
      <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900" on:click={saveNote}>Save</button>
    </div>
  </div>
  <hr>
  <textarea class="mt-4 block w-full h-60 bg-gray-50 border border-gray-300 rounded-lg p-2.5" bind:value={note} name="note" placeholder="Take a note..."></textarea>
</main>

<style>
  .bg-light-gray {
    background-color: rgb(240, 240, 240);
  }

  .bg-red {
    background-color: red;
  }
  .bg-dark-gray {
    background-color: rgb(219, 219, 219);
  }

  .my-svg:hover {
   height: 26px;
   width: 26px;
  }

  header {
    position: fixed;
    top: 0;
    left: 0;
    height: 70px;
    width: 100%;
    background-color: #f8f9fa;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    z-index: 50;
  }

  main, aside{
    margin-top: 70px; /* Adjust this value if the header height changes */
  }

  .search-bar {
    width: 400px;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    position: fixed;
    margin-left: 230px;
  }

  .filtered-pages {
    height: fit-content;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 246px;
    top: 60px;
    background-color: #fff;
    border: 1px solid #ccc;
    /* padding: 0.5rem; */
    z-index: 60;
    max-height: calc(100vh - 70px);
    overflow-y: auto;
    width: 400px;
    border-radius: 5px;
  }

  .filtered-page {
    padding: 5px;
    padding-left: 10px;
    list-style: none;
    border-bottom: 1px solid rgb(241, 241, 241);
    color: rgb(26, 26, 26);
  }

  .filtered-page:hover {
    background-color: rgb(231, 231, 231);
    cursor: pointer;
  }
</style>