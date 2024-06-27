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

<aside class="fixed top-0 left-0 z-40 w-64 h-screen bg-gray-200 shadow-lg">
  <div class="overflow-y-auto py-5 px-3 h-full border-r border-gray-300">
    <ul class="space-y-3">
      {#each pages as page, index}
        <li>
          <button
            on:click={() => selectPage(index)}
            class="{index == currentPageIndex ? 'bg-blue-500 text-white' : 'text-gray-900'} flex justify-between items-center py-2 px-4 rounded-lg w-full text-left hover:bg-blue-400 hover:text-white transition duration-150"
          >
            <span>{page}</span>
            <button class="ml-2 text-red-500 hover:text-red-700 transition duration-150" on:click={() => deletePage(index)}>
              &#10006;
            </button>
          </button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium text-blue-600 hover:text-blue-800 transition duration-150">Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-8 ml-64 h-auto bg-gray-50 shadow-lg rounded-lg">
  <div class="flex items-center mb-6">
    <h1 class="text-2xl font-bold w-3/4 p-3 bg-gray-200 rounded-lg" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-green-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-green-600 transition duration-150" on:click={saveNote}>Save</button>
  </div>
  <hr />

  <textarea class="mt-6 block w-full h-96 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150" bind:value={note}></textarea>
</main>

<style>
  aside {
    background-color: #F0F4F8;
  }
  main {
    background-color: #FFFFFF;
  }
  h1 {
    color: #333333;
  }
  textarea {
    background-color: #FAFAFA;
  }
</style>
