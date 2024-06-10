<script>
import{ onMount } from 'svelte';
 
 let pages = [];
 let currentPageIndex = 0;
 let title = '';
 let note = '';

 onMount(() => {
  const savedPages = localStorage.getItem("pages");
  if(savedPages){
    pages = JSON.parse(savedPages);
    title = pages[currentPageIndex] || "New Page";
    note = localStorage.getItem(title);

  } else{
    addPage();
  }

 });

 function saveNote(){
  const storedPageName = pages[currentPageIndex];
  if (storedPageName !=title) {
    localStorage.removeItem(storedPageName);
    pages[currentPageIndex] = title;
  }
  localStorage.setItem(title, note);
  localStorage.setItem("pages", JSON.stringify(pages));
 }

function addPage(){
  pages.push("New Page");
  selectPage(pages.length ? pages.length - 1: 0)
}

function deletePage(){
  if (pages.length > 1) {
    localStorage.removeItem(pages[currentPageIndex]);
    pages.splice(currentPageIndex, 1);
    localStorage.setItem("pages", JSON.stringify(pages));
    selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
  } else {
    localStorage.removeItem(pages[currentPageIndex]);
    pages = [];
    addPage();
  }
}

function selectPage(index) {
  currentPageIndex = index;
  title = pages[currentPageIndex];
  note = localStorage.getItem(title);

}
</script>

<aside class="fixed top-0 left-0 z-45 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-250">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
         <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-950 rounded-lg">{page}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium mt-3">+ Add Page</button>
      </li>
      <li class="text-center"><button on:click={deletePage} class="font-medium mt-3">Delete</button></li>

    </ul>
  </div>
</aside>

<main class="p-5 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto block bg-gray-700 border border-gray-1000 rounded-lg font-medium text-sm text-white px-5 py-2.5 hover:bg-gray-900" on:click={saveNote}>SAVE</button>
  </div>
  <hr/>
  <textarea class="mt-3 mb-3 block w-full bg-gray-150 border border-gray-1000 rounded-lg text-gray-750 p-2.5" bind:value={note}></textarea>
</main>

<style>
.bg-light-gray{
  background: #FBFBFB;
}
.bg-dark-gray{
  background: #EFEFEF;
}
</style>