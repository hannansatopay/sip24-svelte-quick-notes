<script>
  import {onMount} from 'svelte';

  let pages=[];
  let currentPageIndex=0;
  let title='';
  let note='';

  onMount(() => {
       const savedPages = localStorage.getItem("pages");
       if(savedPages){
         pages=JSON.parse(savedPages);
         title=pages[currentPageIndex];
         note=localStorage.get(title);
       } else {
          addPage();
       }
       
  });

  function saveNote(){
    const storedPageName = pages[currentPageIndex];
    if(storedPageName != title){
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex]=title;
    }
     localStorage.setItem(title,note);
     localStorage.setItem('pages',JSON.stringify(pages));
  }

  function addPage(){
    pages.push("New Page");
    selectPage(pages.length ? pages.length-1:0);
  }

  function selectPage(index){
      currentPageIndex=index;
      title=pages[currentPageIndex];
      note=localStorage.getItem(title);

  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-blue overflow-y-auto py-5 px-3 h-full border-r border-blue-200">

    <ul class="space-y-2">
      {#each pages as page,index}
      <li>
           <button on:click={() => selectPage(index)} class="{index == currentPageIndex ?'bg-dark-blue' :''}py-2 px-3 text-blue-900 rounded-lg">{page}</button> 
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>

  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3"> 
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-blue-900" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  
  <textarea class="mt-3 block w-full bg-blue-50 border border-blue-300 rounded-lg text-blue-900 p-2.5" bind:value={note}></textarea>
  
</main>

<style>
.bg-light-blue {
  background:#e0f2fe;
}
.bg-dark-blue{
  background:#bfdbfe;
}
</style>