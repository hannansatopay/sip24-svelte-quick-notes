<script>
  import{ onMount } from 'svelte';
 let pages = [];
 let currentPageIndex = 0;
 let title = '';
 let note = '';

 onMount(()=> {
  const savedPages = localStorage.getItem("pages");
  if(savedPages) {
    pages = JSON.parse(savedPages);
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }else{
    addPage();
  }
 });

 function saveNote() {
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
  selectPage(pages.length ? pages.length - 1 : 0)
 }

 function deletePage(index){
  const pageToDelete = pages[index];
  pages.splice(index, 1);
  localStorage.removeItem(pageToDelete);
  localStorage.setItem('pages', JSON.stringify(pages));

    if (index === currentPageIndex){
    selectPage(0);
    } else if (index < currentPageIndex){
    currentPageIndex--;
    }
  }

  function selectPage(index){
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }
 
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
        {#each pages as page, index}
        <li>
        <div class="flex items-center justify-between">
          <button
            on:click={() => selectPage(index)}
            class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">
            {page || 'New Page'}
          </button>
          <button on:click={() => deletePage(index)} class="text-gray-500 hover:text-gray-900">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </li>
    {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid-grid-cols-2 item-center mb-3"> 
    <h1 class="text=3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800  text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
 
</main>

<style>
.bg-light-gray{
  background: #FBFBFB ;
}

.bg-dark-gray{
  background: #EFEFEF;
}
</style>