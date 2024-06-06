<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let text = "";

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex];
      text = localStorage.getItem(title);
    } else {
      addPages();
    }
  });
  function saveNote() {
    pages[currentPageIndex] = title;
    localStorage.setItem(title, text);
    localStorage.setItem("pages", JSON.stringify(pages));
  }
  function addPages() {
    pages.push("New Page");
    selectPages(pages.length ? pages.length - 1 : 0);
  }
  function selectPages(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    text = localStorage.getItem(title);
  }
  function clearAllNotes() {
    localStorage.clear();
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-cyan overflow-y-auto h-full">
    <ul>
      {#each pages as page, index}
      <li>
        <button on:click={()=>selectPages(index)} class = "{index == currentPageIndex ? 'bg-gray' : 'bg-white'} bg-white mt-3 ml-3 bg-dark-gray py-2 px-3 rounded-lg">{title || "New Page"}</button>
      </li>
      {/each}
      <li>
        <button on:click={addPages} class="mt-3 ml-3 bg-light-grey py-2 px-3 rounded-lg">Add Page</button>
      </li>
      <li>
        <button on:click={clearAllNotes} class="mt-3 ml-3 bg-blue text-white py-2 px-3 rounded-lg">Delete All Notes</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center">
    <h1 class="text-2xl" contenteditable bind:textContent={title}></h1>
    <button class="ml-20 px-2 py-0.5 block w-100 bg-red-500 text-white rounded-lg" on:click={saveNote}>Save</button>
  </div>
  <textarea class="mt-4 block w-full bg-gray-100 border border-gray-300 rounded-lg" bind:value={text}></textarea>
</main>

<style>
  .bg-light-grey {
    background-color: rgb(218, 209, 209);
  }
  .bg-cyan {
    background-color: lightcyan;
  }
  .bg-blue{
    background-color: blue;
  }

</style>
