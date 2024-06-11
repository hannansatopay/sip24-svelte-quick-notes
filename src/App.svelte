<script>
  import {onMount} from 'svelte';

  let pages =[];
  let currentPageIndex =0;
  let title ='';
  let note = '';

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if(savedPages){
          pages = JSON.parse(savedPages);
          title = pages[currentPageIndex];
          note = localStorage.getItem(title);
    }
    else{
          addPage();
    }
    

  });

  function savenote(){
  const storedPageName = pages[currentPageIndex];
  if(storedPageName != title){
    localStorage.removeItem(storedPageName);
    pages[currentPageIndex]=title;
  }
  
  localStorage.setItem (title, note);
  localStorage.setItem("pages", JSON.stringify(pages));
 }

 function addPage(){
  pages.push("New Page");
  pages = pages;
  selectPage(pages.length ? pages.length-1 : 0);
 }

 function selectPage(index){
  currentPageIndex =index;
  title = pages[currentPageIndex];
  note = localStorage.getItem(title) || '';
 }

 function deleteNotes(){
  pages = [];

    const savedPages = JSON.parse(localStorage.getItem("pages")) || [];
    savedPages.forEach(pageTitle => {
      localStorage.removeItem(pageTitle); 
    });
    localStorage.removeItem("pages");
    addPage();
 }


 function deleteSingleNote()
 {
  if (pages.length > 0) 
  {
      localStorage.removeItem(title); // Remove the note from localStorage
      pages.splice(currentPageIndex,1); // Remove the current page from the pages array
      localStorage.setItem("pages", JSON.stringify(pages)); // Update the pages array in localStorage

      if (pages.length > 0) 
      {
        selectPage(Math.min(currentPageIndex, pages.length - 1)); // Select the next available page
      } 
      else 
      {
        addPage(); // If no pages left, add a new page
      }
  }
 }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class ="bg-light-green overflow-y-auti py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
          <button on:click={()=>selectPage(index)} class ="{index==currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 test-gray-900 rounded-lg">{page}</button>
      </li>
      {/each}
      <li class = "text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
      <li class = "text-center"><button class=" absolute bottom-4 right-12 ml-2 bg-dark-green text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-medium-green" on:click= {deleteNotes}>Delete all Notes</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto" >
  <div class="grid grid-cols-2 items-center">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
</div>
  <hr class = "my-4"/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 "bind:value={note}></textarea>
  <button class=" mt-3 block bg-gray-200 text-dark px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-300" on:click={deleteSingleNote}>Delete</button>
  <button class="mt-3 ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-600" on:click={savenote}>Save</button>
</main>

<style>
  .bg-light-gray{
    background: #FBFBFB;
  }

  .bg-dark-gray{
    background: #EFEFEF;
  }

.bg-dark-green {
    background: #527533;
}

.bg-medium-green {
    background: #69993f;
}

.bg-light-green {
    background: #def5b7;
}
</style>