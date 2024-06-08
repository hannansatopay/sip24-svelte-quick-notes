<script>
  import { onMount } from 'svelte';

  let title = 'New Note';
  let currentPageIndex = 0;
  let note = '';
  let pages = [];

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if(savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    }
  });

  function addNote() {
    pages[currentPageIndex] = title;
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    pages.push("New Note");
    pages = pages;
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }

</script>

<aside class = "fixed left-0 top-0 z-40 w-64 h-screen">
  <div class = "overflow-y-auto bg-gray-200 h-full border-r px-4 py-4">
    <ul class = "space-y-2">
      <li class = "text-5xl font-bold mb-6">NOTES</li>
      {#each pages as page, index}
        <li>
            <button class = "{index === currentPageIndex ? 'px-5 py-1 border border-black rounded-lg' : ''} px-5 py-1 " on:click = {()=>selectPage(index)}>{page}</button>
        </li>
      {/each}
      <li class = "mt-6 text-center"><button on:click = {addPage}>+ Add Note</button></li>
    </ul>
  </div>
</aside>

<main class="flex flex-col ml-64 px-4 py-4 h-screen">
  <div class = "border-b border-gray-400 grid grid-cols-2 items-center mb-1">
    <h1 class = "font-bold text-3xl" contenteditable bind:textContent = {title}></h1>
    <button class="mb-3 ml-auto text-bold border border-black hover:bg-gray-200 px-3 py-1 rounded-lg" on:click={addNote}>SAVE</button>
  </div>
  <textarea class="w-full mt-3 block rounded-lg border border-gray-900 text-gray-900" bind:value={note}></textarea>
</main>

<style>

</style>