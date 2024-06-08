
<script>
 import {onMount} from 'svelte';

 let pages = [];
 let currIndex = 0;
 let title = "";
 let note = "";

 onMount(()=>{
  const savedPages = localStorage.getItem("pages");
  if(savedPages){
    pages = JSON.parse(savedPages);
    title = pages[currIndex];
    note = localStorage.getItem(title);
  } else{
    addPage();
  }
 });

 function saveNote(){

  const storedPageName = pages[currIndex];
  if(storedPageName != title){
    localStorage.removeItem(storedPageName);
    pages[currIndex] = title;
  }

  localStorage.setItem(title, note);
  localStorage.setItem("pages", JSON.stringify(pages));
 }

 function addPage(){
  pages.push("New page");
  selectPage(pages.length ? pages.length-1 : 0);
 }

 function selectPage(index){
  currIndex = index;
  title = pages[currIndex];
  note = localStorage.getItem(title);
 }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-gray-200 border-r">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={()=>selectPage(index)} class="bg-dark-gray px-4 py-2 rounded-lg text-white ">{page}</button>
        </li>
      {/each}
      <li class="text-center"><button class="font-medium" on:click={addPage}>+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}>{title || "New page"}</h1>
    <button on:click={saveNote}  class="ml-auto bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium mt-3 hover:bg-gray-800">Save</button>
  </div>
  <hr/>
  
  <textarea bind:value={note} class="block w-full mt-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"></textarea>
</main>

<style>
  .bg-light-gray{
    background: #FBFBFB;
  }


  .bg-dark-gray{
    background: #793ed8;
  }
</style>