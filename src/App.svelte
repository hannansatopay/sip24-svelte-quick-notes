<script>
  import { onMount } from 'svelte';
  let title = '';
  let note = '';

  onMount(() => {
   const savedpages=localStorage.getItem("pages");
   if(savedpages){
      pages=JSON.parse(savedpages);
      title=pages[currentpageindex];
      note=localStorage.getItem(title);
   }
   else{
addpage();
   }
  });


  function savenote() {

    const storedpageName=pages[currentpageindex];
    if(storedpageName!=title){
      localStorage.removeItem(storedpageName);
      pages[currentpageindex]=title;
    }
    pages[currentpageindex]=title;
   localStorage.setItem(title,note);
   localStorage.setItem("pages",JSON.stringify(pages));
  }
  let pages=[];
  let currentpageindex=0;

  function addpage(){
 pages.push("New page");
 selectpage(pages.length?pages.length-1:0)

  }
  function selectpage(index){
currentpageindex=index;
title=pages[currentpageindex];
note=localStorage.getItem(title);

  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen border-r border-gray-200">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full">
    <ul class="space-y-2">
      {#each pages as page,index}
      <li>
        <button  on:click={()=>selectpage(index)} class="{index==currentpageindex?'bg-dark-gray':''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
      </li>
      {/each}
      <li class="text-center">
       <button class="font-medium" on:click={addpage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class='p-4 ml-60 h-auto'>
  <div class="grid grid-cols-2 items-center">
    <h1 class="text-3xl font-bold "contenteditable bind:textContent={title}>{title||'new page'}</h1>
    <button  
    class="ml-auto mt-3 bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900" 
    on:click={savenote}
  >Save</button>
  </div>
  
  <textarea 
    class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded lg text-gray-900 p-2.5" 
    bind:value={note}
  ></textarea>
  
</main>

<style>
  .bg-light-gray{
    background-color: #fbfbfb;
  }
  .bg-dark-gray{
    background-color: #efefef;
  }
</style>
