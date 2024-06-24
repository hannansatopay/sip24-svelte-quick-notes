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

  function Savenote() {
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

  function deletePage(index) {
    const pageTitle = pages[index];
    if (confirm(`Do you want to delete this "${pageTitle}"?`)) {
      localStorage.removeItem(pageTitle);
      pages.splice(index, 1);
      if (pages.length === 0) {
        addPage();
      } else {
        if (currentPageIndex >= pages.length) {
          currentPageIndex = pages.length - 1;
        }
        selectPage(currentPageIndex);
      }
      localStorage.setItem("pages", JSON.stringify(pages));
    }
  }
</script>

<main>
  Hello World
  <aside class="fixed top-0 left-0 z-40 w-60 h-screen">
    <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
      <ul class="space-y-2">
        {#each pages as page, index}
          <li>
            <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
            <button on:click={() => deletePage(index)} class="ml-2 text-red-500 border border-red-500 rounded-lg px-1">x</button>
          </li>
        {/each}
        <li class="text-center"><button class="font-medium" on:click={addPage}>+ Add Page</button></li>
      </ul>
    </div>
  </aside>

  <div class="p-4 ml-60 h-auto">
    <div class="grid grid-cols-2 items-center mb-3">
      <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
      <button class="ml-auto bg-gray-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={Savenote}>Save</button>
    </div>
    <hr>
    <textarea class="mt-3 w-full bg-gray-100 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  </div>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }
  .bg-dark-gray {
    background: #e6e4e4;
  }
</style>
