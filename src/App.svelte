<script>
  import { onMount } from 'svelte';

  let pages = [];
  let CurrentPageIndex=0;
  let title= ' ';
  let note= ' ';

  onMount(()=> {
      const savePages = localStorage.getItem("pages");
      
      if(savePages){
        pages = JSON.parse(savePages);
        title = pages[CurrentPageIndex];
        note = localStorage.getItem(title);
      }
      else{
        AddPage();
      }
  }
 );

  function SaveNote(){
    const StoredPageName = pages[CurrentPageIndex];
    if(StoredPageName != title){
      localStorage.removeItem(StoredPageName);
      pages[CurrentPageIndex] = title;
    }
    
    localStorage.setItem(title , note);
    localStorage.setItem("pages" , JSON.stringify(pages));

  }

  function AddPage(){
    pages.push("New Page");
    SelectPage(pages.length ? pages.length -1 : 0)
  }

  function SelectPage(index){
    CurrentPageIndex = index ;
    title = pages[CurrentPageIndex];
    note = localStorage.getItem(title);
  }
</script>

 <aside class="fixed top-0 lrft-0 z-40 w-60 h-screen">
  <div class="bg-light-pink overflow-y-auto py-5 px-3 h-full border-r border-black-100" >
    <ul class="space-y-2">
      {#each pages as page , index }      
      <li>
        <button on:click={() => SelectPage(index)} class="bg-dark-pink px-3 py-2 rounded-lg text-white">{page}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={AddPage} class="fount-medium">+ Add page</button></li>
    </ul>
  </div>
 </aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items center mb-3">
    <h1 class="text-3xl font-bold "contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-pink-50 text-white-90 px-5 py-2.5 ml-2 rounded-lg font-medium border border-black-20 text-black mt-3 hover:bg-gray-200  " on:click={SaveNote}>Save</button>
  </div>
 <textarea class="block w-full mt-2 ml-2 bg-pink-50 border border-black rounded-lg text-black p-2.5" bind:value={note}></textarea>
</main>
<style>
 .bg-light-pink{
  background: rgb(203, 176, 176);
 }

 .bg-dark-pink{
  background:rgb(144, 113, 125) ;
 }
</style>