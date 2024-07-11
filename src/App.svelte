<script>
import { onMount } from 'svelte';
 let title = "New Note";
 let note = "today is an good day";
 let pages = [];
 let currentPageIndex = 0;

 onMount(() => {
  const savedPages = localStorage.getItem("pages");
  if(savedPages){
    pages = JSON.parse(savedPages);
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }
  else{
    addPage();
  }
 });
 function saveNote(){
  const storedPageName = pages[currentPageIndex];
  if(storedPageName != title){
    localStorage.removeItem(storedPageName);
    pages[currentPageIndex] = title;
  }
  localStorage.setItem(title,note);
  localStorage.setItem("pages",JSON.stringify(pages));
}

function addPage(){
  pages.push("New Page");
  selectPage(pages.length ? pages.length-1:0);
}

function selectPage(index){
currentPageIndex = index;
title = pages[currentPageIndex];
note = localStorage.getItem(title);
}
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-grey':''} py-3 px-3 text-gray-900 rounded-lg"> {page}</button>      
      </li>
      {/each}
      <li class="text-center"><button class="font-medium" on:click={addPage}>Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center">
    <h1 class="text-3xl font-bold"contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-500 text-white px-5 py-2.5 rounded-lg font-medium mt-3 hover:bg-gray-800" on:click={saveNote}>Save</button>
  </div>
  <input class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={title} type="text" placeholder="Add Title">
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"  bind:value={note}></textarea>
 
</main>

<style>

</style>