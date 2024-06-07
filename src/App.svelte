<script>

import {onMount} from "svelte";

let title= 'New Page';
let note ='';
let pages = [];
let currentPageIndex = 0;
onMount(()=>{
  title= localStorage.getItem("title" );
  note = localStorage.getItem("note");


})

function saveNote(){
localStorage.setItem(title,note);
}

function addPage(){
  pages.push("New Page");
  pages = pages;
}
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page,index}
      <li>
     
        <button  class="bg-dark-gray py-2 px-3 text-gray-900 rounded-lg">
          {page}
        </button>
        
     
      </li>
      {/each}
      <li class="text-center"><button class="font-medium" on:click={addPage}> + Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-start mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}>
    
    </h1>
    <button class="bg-gray-800 text-white px-5 ml-auto py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr/>

 <textarea class="block w-full mt-3 bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>

</main>

<style>
.bg-light-gray{
  background: #fbfbfb;
}
.bg-dark-gray{
  background: #efefef;
}
</style>