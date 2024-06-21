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
    if (pages.length === 1) return; // Don't allow deleting the last page

    const isCurrentPage = pageIndex === currentPageIndex;
    pages.splice(pageIndex, 1);

    if (isCurrentPage) {
      selectPage(pageIndex > 0 ? pageIndex - 1 : 0); // Select previous page if current is deleted
    }

    localStorage.removeItem(pages[currentPageIndex]); // Remove old title entry
    localStorage.setItem("pages", JSON.stringify(pages));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-blue overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button
            on:click={() => selectPage(index)}
            class="{index == currentPageIndex ? 'bg-dark-blue' : ''} py-2 px-3 text-white-green rounded-lg"
          >
            {page}
            <button class="ml-2 text-red-500 hover:text-red-700" on:click={() => deletePage(index)}>
              &#10006; 
              
            </button>
          </button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium text-black hover:underline">Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold text-dark-blue" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-yellow-700" on:click={saveNote}>Save</button>
  </div>
  <hr />

  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-800 p-2.5" bind:value={note}></textarea>

</main>

<style>
  .bg-light-blue {
    background: #E0F9FA;
  }
  .bg-dark-blue {
    background: #0278D1;
  }
  .text-dark-blue {
    color: #0488D1;
  }
</style>
