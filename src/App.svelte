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
      note = localStorage.getItem(title) || '';
    } else {
      addPage();
    }
  });

  function saveNote() {
    pages[currentPageIndex] = title;
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      localStorage.setItem(storedPageName, note);
    }
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || '';
  }

  function deletePage() {
    if (pages.length > 1) {
      const pageToDelete = pages[currentPageIndex];
      pages.splice(currentPageIndex, 1);
      localStorage.removeItem(pageToDelete);
      localStorage.setItem("pages", JSON.stringify(pages));

      if (currentPageIndex >= pages.length) {
        currentPageIndex = pages.length - 1;
      }

      title = pages[currentPageIndex];
      note = localStorage.getItem(title) || '';
    } else {
      localStorage.clear();
      pages = [];
      addPage();
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} px-2 py-3 text-gray-900 rounded-lg">{page || "New Page"}</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex space-x-2">
      <button class="bg-black text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue" on:click={saveNote}>Save</button>
      <button class="bg-red text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue" on:click={deletePage}>Delete</button>
    </div>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border-grey-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #Fbfbfb;
  }
  .bg-dark-gray {
    background: #efefef;
  }
  .bg-red {
    background: red;
  }
  .hover\:bg-blue:hover {
    background: blue;
  }
</style>
