<script>
  import { onMount } from 'svelte';
  import { set, get, del, keys } from 'idb-keyval';

  let pages = [];
  let Title = "Wednesday";
  let note = "";
  let currentPageIndex = 0;

  onMount(async () => {
    const savedPages = await get("pages");
    if (savedPages) {
      pages = savedPages;
      Title = pages[currentPageIndex] || "New Page";
      note = await get(Title);
    } else {
      addPage();
    }
  });

  async function savenote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== Title) {
      await del(storedPageName);
      pages[currentPageIndex] = Title;
    }
    await set(Title, note);
    await set("pages", pages);
  }

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    Title = pages[currentPageIndex];
    note = await get(Title);
  }

  async function deletePage(index) {
    const pageName = pages[index];
    pages.splice(index, 1);
    await del(pageName);
    await set("pages", pages);

    if (currentPageIndex === index && pages.length > 0) {
      selectPage(Math.min(index, pages.length - 1));
    } else if (pages.length === 0) {
      addPage();
    } else {
      currentPageIndex = Math.min(currentPageIndex, pages.length - 1);
      Title = pages[currentPageIndex];
      note = await get(Title);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class='space-y-2'>
      {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-azure' : ''} py-2 px-3 text-gray-900 rounded-lg w-full text-left">{page}</button>
          <button on:click={() => deletePage(index)} class="text-red-500 px-3">Delete</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium py-2 px-3 w-full text-left">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center"> 
    <h1 class="text-5xl font-bold" contenteditable bind:textContent={Title}></h1>
    <button class="ml-auto bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-700" on:click={savenote}>Save</button>
  </div>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }

  .bg-azure {
    background: azure;
  }

  button {
    height: 40px; /* Ensure consistent height */
  }
</style>
