<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
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
    if (storedPageName !== title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }

    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }

  function deletePage(pageIndex) {
    if (pages.length === 1) return; 

    const isCurrentPage = pageIndex === currentPageIndex;
    pages.splice(pageIndex, 1);

    if (isCurrentPage) {
      selectPage(pageIndex > 0 ? pageIndex - 1 : 0); 
    }

    localStorage.removeItem(pages[currentPageIndex]); 
    localStorage.setItem("pages", JSON.stringify(pages));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen bg-gray-100 shadow-lg">
  <div class="overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button
            on:click={() => selectPage(index)}
            class="{index == currentPageIndex ? 'bg-gray-300' : ''} flex justify-between items-center py-2 px-3 text-gray-900 rounded-lg w-full text-left hover:bg-gray-200 transition duration-150"
          >
            <span>{page}</span>
            <button class="ml-2 text-red-500 hover:text-red-700 transition duration-150" on:click={() => deletePage(index)}>
              &#10006;
            </button>
          </button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium text-blue-600 hover:text-blue-800 transition duration-150">Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-8 ml-60 h-auto bg-white shadow-lg rounded-lg">
  <div class="flex items-center mb-6 flex-col-2">
    <h1 class="text-2xl font-bold w-3/4 p-3" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-blue-600 transition duration-150" on:click={saveNote}>Save</button>
  </div>
  <hr />

  <textarea class="mt-6 block w-full h-96 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }
  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
