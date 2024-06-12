<script>
 import { onMount } from 'svelte';

 let pages = [];
 let currentPageIndex = 0;
 let title = '';   
 let note = '';

 onMount(() => {
  const savedPages = localStorage.getItem('pages');
  // title = localStorage.getItem('title');
  // note = localStorage.getItem('note');
  // to save pages exist we created the below structure
  if(savedPages){
    pages = JSON.parse(savedPages);     // JSON.parse convert string back to array
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  } else {
    addPage();
  }

 });

 function savenote() {
  const storedPagesName = pages[currentPageIndex];
  if(storedPagesName != title){
    localStorage.removeItem(storedPagesName);
    pages[currentPageIndex] = title;
  }
  // to keep it dynamic
  localStorage.setItem(title,note);
  localStorage.setItem("pages",JSON.stringify(pages));   //JSON.stringify convert array to string
  
  // console.log(title,note);
  // localStorage.setItem('title',title);
  // localStorage.setItem('note',note);
}

 function addPage(){
  pages.push("New page");
  selectPage(pages.length ? pages.length - 1 : 0);
 }

 function selectPage(index) {
  currentPageIndex = index;
  title= pages[currentPageIndex];
  note = localStorage.getItem(title);
 }

 function deletePage() {
  // Remove the current page's title and note from local storage
  localStorage.removeItem(pages[currentPageIndex]);

  // Remove the page from the pages array
  pages.splice(currentPageIndex, 1);

  // Update the currentPageIndex to reflect the change
  if (pages.length === 0) {
    // If there are no pages left, reset to a new page
    addPage();
  } else {
    // Otherwise, select the previous page or the first page if we're at index 0
    selectPage(currentPageIndex === 0 ? 0 : currentPageIndex - 1);
  }

  // Save the updated pages array to local storage
  localStorage.setItem('pages', JSON.stringify(pages))
 }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen"> 
<div class="bg-light-gray overflow-y-auto py-5 py-3 h-full border-r border=gray-200">
  <ul class="spacde-y-2">
    {#each pages as page,index }
      <li>
        <button on:click={()=>selectPage(index)} class ="{index==currentPageIndex ? 'bg-dark-gray': ''} py-2 px-3 text-gray-900 rounded-lg"> {page} </button> 
      </li>
    {/each}
    <li class="text-centre"><button on:click={addPage} class="font-medium">+ Add page</button></li>
  </ul>
</div>
</aside>

<main class="p-4 ml-60 h-auto ">
  <div class="grid grid-cols-2 item-center mb-3">
    <h1 class="text-3xl font-bold"contenteditable bind:textContent={title}></h1>
    <button class =" ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-green-800" on:click={savenote}>Save</button>
  </div>
  <hr/>
  <textarea class="block w-full bg-gray-50 border border-gray-300 rounded lg text-gray-900 p-2.5 mt-5" bind:value={note}></textarea>
  <button class=" ml-auto mb-auto bg-red-600 text-white px-10 py-3 rounded-lg font-medium text-sm mt-10  hover:bg-blue-500" on:click={deletePage}> Delete </button>

</main>

<style>
.bg-light-gray {
  background: #fbfbfb;
}
.bg-dark-gray{
  background: #efefef;
}
</style>

/* // indexdb task is difficult to it will take some time to learn it  */