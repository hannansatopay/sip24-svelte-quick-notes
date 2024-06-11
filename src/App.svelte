<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = null;
  let title = '';
  let note = '';

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      if (pages.length > 0) {
        selectPage(0);
      }
    }
  });

  function saveNote() {
    if (!title) return;

    pages[currentPageIndex] = title;
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    const newPage = `New Page ${pages.length + 1}`;
    pages.push(newPage);
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPageIndex = index;
    if (pages[currentPageIndex]) {
      title = pages[currentPageIndex];
      note = localStorage.getItem(title) || '';
    } else {
      title = "This page is deleted";
      note = '';
    }
  }

  function deletePage(index) {
    const pageToDelete = pages[index];
    localStorage.removeItem(pageToDelete);
    pages.splice(index, 1);

    if (currentPageIndex >= index) {
      currentPageIndex = Math.max(0, currentPageIndex - 1);
    }

    if (pages.length > 0) {
      selectPage(currentPageIndex);
    } else {
      currentPageIndex = null;
      title = '';
      note = '';
    }

    localStorage.setItem("pages", JSON.stringify(pages));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="flex-grow bg-dark-gray py-2 px-3 text-gray-900 rounded-lg text-left">{page}</button>
          <button on:click={() => deletePage(index)} class="ml-2 text-red-600">Delete</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  {#if currentPageIndex !== null}
    <div class="grid grid-cols-2 items-center mb-3">
      <h1 class="text-2xl font-bold" contenteditable bind:innerText={title}>{title || 'New Page'}</h1>
      <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
    </div>
    <hr>
    <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  {:else}
    <p class="text-center">No pages available. Please add a new page.</p>
  {/if}
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }
  .bg-dark-gray {
    background: gray;
  }
  .ml-2 {
    margin-left: 0.5rem;
  }
</style>
