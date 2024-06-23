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
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || '';
  }

  function deletePage(index) {
    if (confirm("Are you sure you want to delete this note?")) {
      const pageTitle = pages[index];
      pages.splice(index, 1);
      localStorage.removeItem(pageTitle);
      if (pages.length > 0) {
        selectPage(Math.min(index, pages.length - 1));
      } else {
        addPage();
      }
      localStorage.setItem("pages", JSON.stringify(pages));
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-purple overflow-y-auto py-5 px-3 h-full border-r border-purple-280">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-purple':''} py-2 px-3 text-purple-900 rounded-lg">{page}</button>
          <button on:click={() => deletePage(index)} class="ml-2">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.136 21H7.864a2 2 0 01-1.997-1.858L5 7m5 4v6m4-6v6m1-10V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0H5"></path>
            </svg>
          </button>
        </li> 
      {/each}
      
      <li class="text-center">
        <button on:click={addPage} class="font-medium ">+ Add page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-purple-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-purple-900" on:click={saveNote}>Save</button>
  </div>
  <hr>
  <textarea class="mt-3 block w-full bg-purple-50 border border-purple-300 rounded-lg text-purple-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-purple {
    background: #e6e6fa;
  }

  .bg-dark-purple {
    background: #d8d8fa;
  }

  .text-red-500 {
    color: #f56565;
  }
</style>
