<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  let searchQuery = '';

  onMount(() => {
    const savedPages = localStorage.getItem('pages')
    if (savedPages) {
      pages = JSON.parse(savedPages);
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
    localStorage.setItem('pages', JSON.stringify(pages));
  }

  function addPage() {
    pages.push('New Task');
    selectPage(pages.length ? pages.length - 1 : 0)
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }

  function deletePage(index) {
    const pageName = pages[index];
    localStorage.removeItem(pageName);
    pages.splice(index, 1);
    localStorage.setItem('pages', JSON.stringify(pages));
    if (currentPageIndex === index) {
      selectPage(currentPageIndex === 0 ? 0 : currentPageIndex - 1);
    }
  }

  function clearNote() {
    note = '';
  }

  function filterNotes() {
    return pages.filter(page => page.toLowerCase().includes(searchQuery.toLowerCase()));
  }
</script>

<aside class='fixed top-0 left-0 z-40 w-60 h-screen'>
  <div class='bg-gradient-to-b from-purple-600 to-indigo-600 overflow-y-auto py-5 px-3 h-full border-r border-gray-200'>
    <input type="text" placeholder="Search..." bind:value={searchQuery} class="bg-white border border-indigo-300 rounded-lg p-2.5 mb-3 w-full"/>
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class='{index==currentPageIndex ? 'bg-indigo-700' : 'bg-indigo-500'} py-2 px-3 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200'>{page}</button>

        <button on:click={() => deletePage(index)} class='bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg font-medium text-sm ml-2'>Delete</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class='bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded-lg'>+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class='p-4 ml-60 h-auto'>

  <h1 class="headline font-bold text-purple-900 "> QUICK NOTES </h1>
  <hr/>
  <br>
  <div class="grid grid-cols-2 items-center mb-3">
    
    <h1 class="text-3xl font-bold text-indigo-800 p-2 " contenteditable bind:textContent={title}></h1>
    
    <button class='ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 transition-colors duration-200' on:click={saveNote}>Save</button>

    <h1> </h1>

    <button class='ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 transition-colors duration-200' on:click={clearNote}>Clear</button>
  
  </div>
  <hr class="border-indigo-300"/>
  
  <textarea class='mt-3 block w-full bg-white border border-indigo-300 rounded-lg text-gray-900 p-2.5' bind:value={note}></textarea>

</main>

<style>
  .bg-gradient-to-b {
    background: linear-gradient(to bottom, #6b46c1, #4f46e5);
  }

  .headline{
    font-size: larger;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    text-align: center;
  }
</style>
