<script>
  import { onMount } from 'svelte';

  let pages = [];
  let title = 'new note';
  let currentPageIndex = 0;
  let note = 'was a good day!';

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      if (pages.length > 0) {
        title = pages[currentPageIndex];
        note = localStorage.getItem(title) || '';
      } else {
        addPage();
      }
    } else {
      addPage();
    }
  });

  function saveNote() {
    const storagePageName = pages[currentPageIndex];
    if (storagePageName != title) {
      localStorage.removeItem(storagePageName);
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

  function deletePage() {
    if (pages.length > 0) {
      const pageTitle = pages[currentPageIndex];

      // Remove the item from localStorage
      localStorage.removeItem(pageTitle);

      // Remove the item from the pages array
      pages = pages.filter((_, index) => index !== currentPageIndex);

      // Update the pages array in localStorage
      localStorage.setItem("pages", JSON.stringify(pages));

      if (pages.length > 0) {
        // Adjust the currentPageIndex if it points to a non-existent page
        if (currentPageIndex >= pages.length) {
          currentPageIndex = pages.length - 1;
        }
        // Select the next page (or the last page if the current was the last one)
        const newPageTitle = pages[currentPageIndex];
        title = newPageTitle;
        note = localStorage.getItem(newPageTitle) || '';
      } else {
        // If no pages are left, reset the title and note
        title = 'new note';
        note = 'was a good day!';
        currentPageIndex = 0;
      }
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
      </li>
      {/each}
      <li class="text-center">
        <button class="font-medium" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>

    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={deletePage}>Delete</button>
  </div>
  
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background-color: #FBFBFB;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }
</style>
