<script>

 import { onMount } from 'svelte';

 let pages = [];
 let currentPageIndex = 0;
 let title='';
 let note='';

 onMount(() => {
  const savedPages = localStorage.getItem("pages");
  if (savedPages) {
    pages = JSON.parse(savedPages);
    title = pages(currentPageIndex);
    note = localStorage.getItem(title);
  } 
  else{
    addPage();
  }
 });


function savenote() {
  const storedPageName = pages[currentPageIndex];
  if (storedPageName != title) {
    localStorage.removeItem(storedPageName);
    pages[currentPageIndex] = title;
  }
  localStorage.setItem(title, note);
  localStorage.setItem("pages",JSON.stringify(pages));
}

function addPage() {
  const newPageName = ("New Note:") || "New Page"; 
  pages.push(newPageName); 
  selectPage(pages.length - 1); 
}

function deletePage() {
  if (pages.length > 0) {
    pages.pop(); 
    selectPage(pages.length > 0 ? pages.length - 1 : -1);
  }
}


function selectPage(index) {
  currentPageIndex = index;
  title = pages[currentPageIndex];
  note = localStorage.getItem(title);
}

</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
<div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
  <ul class="space-y-2">
    {#each pages as page, index (index)}
      <li>
        <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        <button on:click={() => deletePage(index)} class="ml-2 py-2 px-3 text-red-600 rounded-lg">Delete</button>
      </li>
    {/each}
  
    <li class="text-center">
      <button on:click={addPage} class="font-medium">
        + Add page
      </button>
    </li>
  </ul>
  
</div>

</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto mt-3 bg-pink-50 text-gray-2 px-5 py-2.5 rounded-lg border border-purple-300 font-medium text-sm hover:bg-blue-100" on:click={savenote}>Save</button>
  </div>
<hr/>

  
  <textarea  class="mt-3 block w-full bg-pink-50 border border-purple-300 rounded-lg text-pink-900 p-2.5" bind:value={note}></textarea>
  
</main>

<style>
.bg-light-gray{
  background: #fbfbfb;
}

.bg-dark-gray{
  background: #efefef;
}

</style>