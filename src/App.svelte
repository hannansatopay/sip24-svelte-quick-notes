<script>
  import {onMount} from 'svelte';


  let pages =[];
  let currentPageIndex = 0;
  let title ='';
  let note ='';

  onMount(()=>{
    const savedPages = localStorage.getItem("pages");
    if(savedPages){
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex] ;
      note = localStorage.getItem(title);
    }
    else{
      addPage();
      deletePage();
    }

  });
 

 function savenote() {
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
  selectPage(page.length ? page.length-1:0 )
 }
 function deletePage(index) {
  if (pages.length > 1 && index >= 0 && index < pages.length) {
    pages.splice(index, 1);

    if (index === currentPageIndex) {
      currentPageIndex = Math.max(0, currentPageIndex - 1);
    }

    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
    localStorage.setItem("pages", JSON.stringify(pages));
  }
}


 function selectPage(index){
  currentPageIndex = index;
  title = pages[currentPageIndex];
  note = localStorage.getItem(title);
 }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200 ">
    <ul class="space-y-2" >
      {#each pages as page,index}
      <li>
        <button on:click={()=> selectPage(index)} class ="{index == currentPageIndex ? 'bg-dark-gray' :''} py-2 px-3 text-gray-900 rounded-lg"> {page} </button>
      </li>
      {/each}

      <li class="text-center"><button on:click={addPage} class="font-medium">+Add Page</button> </li>

      {#each pages as page, index}
      <li>
        <button on:click={()=> selectPage(index)} class ="{index == currentPageIndex ? 'bg-dark-gray' :''} py-2 px-3 text-gray-900 rounded-lg">
          {page}
        </button>
        <button class="text-red-500 hover:text-red-700" on:click={() => deletePage(index)}>️🗑️</button>
      </li>
      {/each}

  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click ={savenote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-color-50 border border-gray-300 rounded-lg text-gray-900 "bind:value = {note}></textarea>
</main>

<style>
.bg-light-gray{
  background:#FBFBFB;

}
.bg-dark-gray{
  background:#EFEFEF;
}
</style>