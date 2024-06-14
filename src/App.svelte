<script>
  import{onMount} from 'svelte';

  let pages=[];
  let currentPageIndex=0;
  let title='';
  let note='';

  onMount(() => {
    const savedPages=localStorage.getItem("pages")
    if(savedPages){
      pages=JSON.parse(savedPages)
      title=pages[currentPageIndex] || "New Page"
      note=localStorage.getItem(title)
    }
    else{
      addPage();
    }
    
    const deletePages=localStorage.removeItem("pages")
    removePage();
  });

  function saveNote(){
    pages[currentPageIndex]=title;
    localStorage.setItem(title,note);
    localStorage.setItem("pages",JSON.stringify(pages));
  }

  function deleteNote(){
    removePage();
    localStorage.removeItem(title);
    localStorage.removeItem("pages");
  }

  function removePage(){
    pages.pop();
    pages=pages;
  }

  function addPage(){
    pages.push("New Page");
    pages=pages;
    selectPage(pages.length? pages.length-1:0); 
  }

  function selectPage(index){
    currentPageIndex=index;
    title=pages[currentPageIndex]
    note=localStorage.getItem(title);
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
 <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
  <ul class="space-y-2">
  {#each pages as page,index}
   <li>
      <button on:click={()=> selectPage(index)} class="{index==currentPageIndex? "bg-dark-gray":"" } py-2 px-3 text-gray-900 rounded-lg">{page}</button>
   </li>
   {/each}
   <li class="text-center">
    <button on:click={addPage} class="font-medium border rounded-lg py-2 px-2 bg-gray-100">+ Add page</button>
   </li>
  </ul>
 </div>
</aside>
<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center">
     <hi class="text-3xl font-bold mb-2" contenteditable bind:textContent={title}>{title || "Add Title"}</hi>
  </div>
<hr/>
  
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900" bind:value={note}></textarea>
  <button class="mt-3 bg-gray-800 rounded-lg text-white px-5 py-1 font-medium text-small hover:bg-red-600" on:click={saveNote}>save</button>
  <button class="mt-3 bg-gray-800 rounded-lg text-white px-4 py-1 font-medium text-small hover:bg-red-600" on:click={deleteNote}>Delete</button>
</main>

<style>
.bg-light-gray{
  background: #FBFBFB;
}
.bg-dark-gray{
  background: #EFEFEF;
}
</style>