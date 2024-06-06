<script>
  import {onMount} from 'svelte'
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  
  onMount(() => {
 const savedPages = localStorage.getItem("pages");
 if (savedPages){
  pages=JSON.parse(savedPages);
  title=pages[currentPageIndex];
  note = localStorage.getItem(title);
 }
 else{
 addpages();
 }
});

  function saveNote(){
    const storedPageName = pages[currentPageIndex];
    if(storedPageName != title){
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex]=title;
    }
   localStorage.setItem(title,note);
   localStorage.setItem("pages",JSON.stringify(pages));
  }
  function addpages(){
    pages.push("New Page");
    selectpage(pages.length ? pages.length-1 : 0 );
  }
  function selectpage(index){
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }
  function deletePage(index) {
    localStorage.removeItem(pages[index]);
    pages.splice(index, 1);
    if (index === currentPageIndex) {
      selectpage(0);
    } else if (index < currentPageIndex) {
      currentPageIndex--;
    }
    localStorage.setItem("pages", JSON.stringify(pages));
  }
  </script>
<aside class="fixed top-0 left-0  z-40 w-60 h-screen"> 
  <div class="bg-light-grey overflow-y-auto py-5 px-3 h-full border r border-gray-300">
   <ul class="space-y-3">
    {#each pages as page, index }
    <li>
    <button on:click={()=>selectpage(index)} class="{index == currentPageIndex?'bg-dark-grey':''} py-3 px-5 text gray-900 rounded-lg ">{page} </button> 
    <button on:click={() => deletePage(index)} class="ml-2 text-red-600 hover:text-red-900">Delete</button>
    </li>
      {/each}
    <li class="</text-center"><button on:click={addpages} class="font-medium">+add page </button></li>
   </ul>
  </div>
</aside>
<main class = "p-4 ml-60 h-auto">
   <div class="grid grid-cols-2 items-center mb-3">
    
    <h1 class="text-3xl font-bold " contenteditable bind:textContent={title}></h1>
    <button class =" ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-900"on:click={saveNote}>Save</button>
   </div>
   <hr/>
  <textarea class = " mt-3 block w-full bg-gray-50 border border-grey-300 rounded-lg text-gray-900 p-3.5 "bind:value={note}></textarea>
</main>
  
  <style>
  .bg-light-grey {
    background: rgb(237, 203, 203);
  }
  .bg-dark-grey{
    background: whitesmoke ;
  }
  </style>