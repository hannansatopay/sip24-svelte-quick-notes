<script>
  import {onMount} from 'svelte';

 let pages = [];
 let currentPageIndex = 0;
 let title ='';
 let note = '';

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if(savedPages){
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    } else{
      addPage();
    }
  });

 function saveNote(){
  const storedPageName = pages[currentPageIndex];
  if (storedPageName != title) {
    localStorage.removeItem(storedPageName);
    pages[currentPageIndex] = title;
  }
  localStorage.setItem(title, note);
  localStorage.setItem("pages", JSON.stringify(pages));
 }

 function addPage(){
  pages.push("New Page");
  selectPage(pages.length ? pages.length - 1 : 0)
  deletePage(page.length ? pages.length - 1 : 0)
 }

 function selectPage(index){
  currentPageIndex = index;
  title = pages[currentPageIndex];
  note = localStorage.getItem(title);
 }

 function deletePage(){
  if (pages.length >= 1) {
    const pageTitle = pages[currentPageIndex];
    localStorage.removeItem(pageTitle);
    pages.splice(currentPageIndex, 1);
    if (currentPageIndex > 0) {
      currentPageIndex--;
    }
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
    localStorage.setItem("pages", JSON.stringify(pages));
  }
}

</script>

<aside class="fixed top-0 left-0 z-40 w-40 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-8 h-full border-r border-gray-900">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
          <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} w-full rounded-lg py-2 px-3 text-gray-900 text-white">{page}</button>
      </li>
      {/each}
main
      <li class="text-centre"><button on:click={addPage} class="front-medium text-white">+Add Page</button></li>
main
    </ul>
  </div>
</aside>

<main class='p-4 ml-60 h-auto'>
  <div class="grid grid-cols-2 item-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="flex justify-end">
main
     <button on:click={saveNote} class="mr-2 w-20 border border-gray-50 bg-green-600 rounded-lg text-white font-medium hover:bg-green-400 px-5 py-2.5">Save</button>
     <button on:click={deletePage} class="w-20 border border-gray-50 bg-red-600 rounded-lg text-white font-medium hover:bg-red-400 px-4 py-2.5">Delete</button>
main
    </div>
  </div>
  <hr/>
  <textarea bind:value={note} class="mt-4 w-full border  bg-gray-50 border gray-300 text-gray-900 rounded-lg p-2.5"></textarea>
  
</main>

<style>
.bg-light-gray{

.bg-dark-gray{
  background-color: rgb(204, 204, 255);
}

hr {
            top: 20px;
            bottom: 20px;
            height: 2px;
            background: rgb(16, 16, 16);
        }
</style>

  background-color: rgb(50, 4, 70);
}
.bg-dark-gray{
  background-color: rgb(76, 9, 85);
}

hr {
            top: 20px;
            bottom: 20px;
            height: 2px;
            background: rgb(16, 16, 16);
        }
</style>
main
