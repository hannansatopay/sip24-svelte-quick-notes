<script>
// @ts-nocheck

  import { onMount } from 'svelte';
let pages=[];
let currentPageIndex=0;
  let title = '';
  let note = '';

  onMount(() => {
    const savedpages = localStorage.getItem("pages")
if (savedpages)
{
pages=JSON.parse(savedpages);
title=pages[currentPageIndex];
note = localStorage.getItem(title)
}
else {
addpage();
}
  });

  function saveNote() {
    const storedpagename=pages[currentPageIndex];
    if(storedpagename != title){
      localStorage.removeItem(storedpagename);
      pages[currentPageIndex]=title;
    }
    pages[currentPageIndex]=title;
    localStorage.setItem(title,note);
    localStorage.setItem("pages",JSON.stringify(pages));
  }
  function addpage() {
pages.push("New Page");
pages=pages;
selectpage(pages.length ? pages.length-1 : 0);
  } 
  function deletePage(index) {
    const pageToDelete = pages[index];
    if (pageToDelete === title) {
      // If the currently selected page is deleted, select the next page if available
      if (index < pages.length - 1) {
        selectpage(index + 1);
      } else if (index > 0) {
        selectpage(index - 1);
      } else {
        // If there are no more pages left, clear the title and note
        title = '';
        note = '';
      }
    }
    localStorage.removeItem(pageToDelete);
    pages.splice(index, 1);
    localStorage.setItem("pages", JSON.stringify(pages));
  }
function selectpage(index)
{
  currentPageIndex = index;
  title=pages[currentPageIndex];
  note=localStorage.getItem(title);
}
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-300">
    <ul class="space-y-2">
      {#each pages as page,index}
      <li>
        <button on:click={() => selectpage(index)} class="{index == currentPageIndex ? 'bg-dark-grey': ''} rounded-lg px-5 py-2.5 font-medium mt-3 hover:bg-gray-900 text-white">{page}</button>
        <button on:click={() => deletePage(index)} class="ml-2 text-red-500">Delete</button>
      {/each}
      <li class="text-center"><button on:click={addpage} class="font-medium">+Add Page</button>
        <!-- svelte-ignore missing-declaration -->
        <button on:click={() => deletePage(index)} class="ml-2 text-red-500">Delete</button>
      </li>
      
    </ul>
  </div>
</aside>

<main class="p-5 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="font-bold text-3xl" contenteditable bind:textContent={title}></h1>
    <button class="bg-gray-500 rounded-lg px-5 py-2.5 font-medium mt-3 hover:bg-gray-900 text-white ml-auto" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #e0dcdc;
  }
  .bg-dark-grey {
    background: #756d6d;
  }
</style>
