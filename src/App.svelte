<script>
  import { onMount } from 'svelte'
  //import{openDB}from 'idb';
  let db;
  let pages = [];
  let title = '';
  let note = '';
  let index =[];
  let currentPageIndex = 0;
  onMount( () => {
    const savedpages = localStorage.getItem('pages');
    if (savedpages) {
      pages=JSON.parse(savedpages);
      title=pages[currentPageIndex];
      note =localStorage.getItem(title);


    }else{
      addpage();

    }


  });
  function savenote (){
    const storedPageName=pages[currentPageIndex];
    if(storedPageName!=title){
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex]=title;
    }
    
    localStorage.setItem(title,note);
    localStorage.setItem('pages',JSON.stringify(pages));
  }
  function addpage(){
    pages.push("new page")
    selectpage(pages.length ? pages.length-1:0);
  }
  function selectpage(index){
    currentPageIndex=index;
    title=pages[currentPageIndex];
    note = localStorage.getItem(title);
  }
  function deletePage() {
    const deletedTitle = pages.splice(currentPageIndex, 1)[0];
    localStorage.removeItem(deletedTitle);
    if (pages.length === 0) {
      addpage();
    } else {
      currentPageIndex = Math.max(0, currentPageIndex - 1);
      selectpage(currentPageIndex);
    }
  }
    
 
</script>
<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-skyblue-200">
    <ul class="space-y-2">
      {#each pages as page,index}
      <li>
        
        <button on:click={()=>selectpage(index)} class="bg-dark-gray {index == currentPageIndex ? 'bg-dark-blue' : ''} py-2 px-3 text-green-900 rounded-lg">{page}</button>
        
      </li>
      {/each}
      <li class="text-center"><button on:click={addpage} class="bg-dark-gray py-2 px-3 text-green-900 font-medium text-sm mt-3 hover:bg-skyblue-900" >+ Add Page</button></li>
      <li class="text-center"><button on:click={deletePage} class="bg-dark-gray py-2 px-3 text-green-900 font-medium text-sm mt-3 hover:bg-skyblue-900" >- Delete Page</button></li>
    
    </ul>
  </div>

</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}>''</h1>
      <button class="ml-auto bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-green-900" on:click={savenote}>save</button>
      
     
  </div>

 
  <textarea class="mt-3 block w-full bg-blue-70 border-black-300 p-2.5" bind:value={note}></textarea>
  
</main>
 
<style>
  .bg-light-gray{
    background: #fbfbfb;
  }
  .bg-dark-gray{
    background: #82fcb7;
  }
  .bg-dark-blue{
    background: #f39a00;
  }


</style>