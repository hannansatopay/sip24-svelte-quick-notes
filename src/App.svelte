<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentpageIndex = 0;
  let title = "";
  let note = "";

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentpageIndex];
      note = localStorage.getItem(title);
    } else {
      addpage();
    }
  });

  function saveNote() {
    const storedpageName = pages[currentpageIndex];
    if (storedpageName != title) {
      localStorage.removeItem(storedpageName);
      pages[currentpageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addpage() {
    pages.push("New page");
    selectpage(pages.length ? pages.length - 1 : 0);
  }

  function selectpage(index) {
    currentpageIndex = index;
    title = pages[currentpageIndex];
    note = localStorage.getItem(title);
  }

  function deletePage() {
    const pageTitle = pages[currentpageIndex];
    pages.splice(currentpageIndex, 1);
    localStorage.removeItem(pageTitle);
    if (pages.length > 0) {
      selectpage(currentpageIndex > 0 ? currentpageIndex - 1 : 0);
    } else {
      addpage();
    }
    localStorage.setItem("pages", JSON.stringify(pages));
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-40 h-screen">
  <div class="bg-ligth-gary overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectpage(index)} class="{index == currentpageIndex ? 'bg-dark-gary' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        </li>
      {/each}
      <li class="text-center"><button on:click={addpage} class="font-medium">+ Addpage</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}>{title || "New Page"}</h1>
    <div class="ml-auto flex space-x-2">
      <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
      <button class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700" on:click={deletePage}>Delete</button>
    </div>
  </div>
  <hr/>
  
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-ligth-gary {
    background: #fbfbfb;
  }
  .bg-dark-gary {
    background: #efefef;
  }
</style>
