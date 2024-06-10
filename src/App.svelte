<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex] || "New Page";
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

  function deletePage() {
    if (pages.length === 1) {
      // If only one page, reset it instead of deleting
      title = "New Page";
      note = "";
      localStorage.setItem(title, note);
    } else {
      const pageToDelete = pages[currentPageIndex];
      localStorage.removeItem(pageToDelete);
      pages.splice(currentPageIndex, 1);

      // Update the index to avoid out-of-bounds issues
      currentPageIndex = Math.min(currentPageIndex, pages.length - 1);

      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    }

    localStorage.setItem("pages", JSON.stringify(pages));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">
          <img src="/icon_note.png" class="w-5 h-5 inline">
         Add Page
        </button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex items-center space-x-2">
      <button class="bg-gray-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>
        Save
      </button>
      <button class="px-2 py-2 rounded-lg text-sm mt-3 hover:bg-gray-900" on:click={deletePage}>
        <img src="/icon_trash.png" class="w-5 h-5 inline">
      </button>
    </div>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #d3cbea;
  }

  .bg-dark-gray {
    background: #8e9baf;
  }

  .bg-royal-blue {
    background: rgb(48, 44, 41);
  }

  .bg-voilet {
    background-color: #cf9aff;
  }

</style>