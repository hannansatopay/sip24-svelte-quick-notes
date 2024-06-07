<script lang="ts">
  import{onMount}from 'svelte';
  onMount(()=>{
    const savedPages=localStorage.getItem("pages");
     if(savedPages){
pages= JSON.parse(savedPages);
title=pages[currentpageIndex];
note=localStorage.getItem(title);
     }
     else{
    addpage();
     }
  });
  let pages=[];
  let currentpageIndex=0;
 let title="New note";
 let note="Today is an nice day";
 function savenote(){
  const storedpagename = pages[currentpageIndex];
  if(storedpagename != title){
    localStorage.removeItem(storedpagename);
    pages[currentpageIndex]=title;
  }
  
  localStorage.setItem(title,note);
  localStorage.setItem("pages",JSON.stringify(pages))
 }
 function addpage(){
  pages.push("New page");
  selectpage(pages.length ? pages.length - 1:0);
 }

 function selectpage(index){
  currentpageIndex=index;
  title = pages[currentpageIndex];
  note=localStorage.getItem(title);
 }
</script>
<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page,index}
      <li>
        
<button on:click={()=>{selectpage(index)}} class="bg-dark-gray py-2 px-3 text-gray-900 rounded-lg">{page}</button>
</li>{/each}
      
      <li class="text-center"><button on:click= {addpage} class ="font-medium "> +Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center n=mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class ="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-5m mt-3 hover:bg-gray-900"on:click={savenote} >Save</button>
  </div>
  <hr/>
  
  <textarea class="mt-3 block w-full bg-gray=50 border border=gray=300 rounded-lg text-gray-900 p-2.5"bind:value={note}></textarea>
  
</main>

<style>
.bg-light-gray{

background:#f8f8f8;
}
.bg-dark-gray{
  background: #efefef;
}

</style>