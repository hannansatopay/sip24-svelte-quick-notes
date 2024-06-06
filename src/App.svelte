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
      if (pages.length > 0) {
        title = pages[currentPageIndex];
        note = localStorage.getItem(title);
      }
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
    pages.push("NewPage");
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }

  function deletePage(index) {
    const pageTitle = pages[index];
    pages.splice(index, 1);
    localStorage.removeItem(pageTitle);
    localStorage.setItem("pages", JSON.stringify(pages));
    if (index === currentPageIndex) {
      if (pages.length > 0) {
        selectPage(index > 0 ? index - 1 : 0);
      } else {
        currentPageIndex = 0;
        title = '';
        note = '';
      }
    } else if (index < currentPageIndex) {
      currentPageIndex--;
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-gray-light h-full overflow-y-auto py-5 px-3 border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex items-center justify-between">
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} font-medium py-2 px-3 text-gray-900 border rounded-lg">{page}</button>
          <button on:click={() => deletePage(index)} class="text-red-500 ml-2">delete</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto mt-3 bg-gray-800 text-white px-5 py-2.5 rounded-lg border border-gray-300 font-thin font-serif hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <div class="border-t dark:border-neutral-500 border-gray-600 my-4 border-dotted"></div>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5 font-serif tracking-wide" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background-color: #fbfbfb;
  }
  .bg-dark-gray {
    background: #efefef;
  }
</style>
