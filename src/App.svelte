<script>
  import { onMount } from 'svelte';
  import db from './dexie';

  let pages = [];
  let filteredPages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let searchQuery = '';

  onMount(async () => {
    pages = await db.notes.toArray();
    filteredPages = pages;
    if (pages.length > 0) {
      selectpg(0);
    } else {
      addpage();
    }
  });

  async function saveNote() {
    const storedPage = pages[currentPageIndex];
    if (storedPage.title !== title) {
      await db.notes.delete(storedPage.id);
      pages[currentPageIndex].title = title;
    }
    await db.notes.put({ id: storedPage.id, title, content: note });
    pages = await db.notes.toArray();
    filterPages();
  }

  async function addpage() {
    const newPage = { title: 'New Page', content: '' };
    const id = await db.notes.add(newPage);
    newPage.id = id;
    pages.push(newPage);
    filterPages();
    selectpg(pages.length - 1);
  }

  function selectpg(index) {
    currentPageIndex = index;
    title = filteredPages[currentPageIndex].title;
    note = filteredPages[currentPageIndex].content;
  }

  async function deletePage() {
    const pageToDelete = filteredPages[currentPageIndex];
    await db.notes.delete(pageToDelete.id);
    pages = pages.filter(page => page.id !== pageToDelete.id);
    filterPages();
    if (filteredPages.length === 0) {
      addpage();
    } else {
      selectpg(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
    }
    alert('Note deleted');
  }

  function clearNote() {
    note = '';
    alert('Note content cleared');
  }

  function filterPages() {
    filteredPages = pages.filter(page => page.title.toLowerCase().includes(searchQuery.toLowerCase()));
    currentPageIndex = 0;
  }


</script>

<aside class="fixed  top-0 left-0 z-40 w-60  h-screen bg-gradient-to-tl from-lime-200 via-sky-500 to-violet-500">
<div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
  <ul class="space-y-2">
    <!-- add for loop for the page -->
    {#each pages as page, index}
        <li><button on:click={()=>selectpg(index)} class="{index==currentPageIndex ?  'bg-dark-gray' :''} py-2 px3 text-gray-900 rounded-lg" >{page.title}
        </button>
      
      </li>
    {/each} 
    <li class="text-center ml-auto ">
      <button on:click={addpage} class="font-medium border-2 rounded-lg py-2 px-3">+add page</button></li>
      
  </ul>
    
</div>

</aside>


<main class="p-4 ml-60 w-auto h-auto bg-gradient-to-tl from-lime-200 via-sky-500 to-violet-500">
  <div class="h-screen"><div class="grid  grid-cols-2 items-center mb-3 "> 
    <h1 class="text-2xl font-semibold "contenteditable bind:textContent={title}></h1>
    <button class= "ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-blue-800 " on:click={saveNote}>Save</button>
  </div>
  <hr/>

  <textarea class="mt-3 h-80 block w-full bg-gray-50 border-black-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  <button on:click={deletePage} class= "ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-blue-800 " >Delete</button></div>
  
 

</main>

<style>
.bg-dark-gray {
  background-color: #20032866;
}
</style>