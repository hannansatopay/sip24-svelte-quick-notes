<script>
  import {onMount} from 'svelte'
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = ''; 
  onMount(()=>{
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex] ;
      note = localStorage.getItem(title);
    } else {
      addPage();
    }
  });
  function saveNote(){
    const updation = pages[currentPageIndex];
    if(updation!==title){
      localStorage.removeItem(updation);
    }
    pages[currentPageIndex] = title;
    localStorage.setItem(title,note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }
  function addPage() {
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }
  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) ;
  }
</script>
<aside class="fixed bg-black top-0 left-0 z-20 w-56 h-screen">
  <div class="bg-gray-900 border-r border-gray-500 h-full overflow-y-auto py-5 px-3 ">
    <ul class=" space-y-2">
      {#each pages as page,index}
        <li> 
          <button on:click={()=>selectPage(index)} class="{index == currentPageIndex?"bg-[#efefef] ": "text-white"} font-medium py-2 px-3 text-gray-900 rounded-lg">{page || "New Page"}</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class=" font-medium text-white">+Add Page</button>
      </li>
    </ul>
  </div>
</aside>
<main class="bg-slate-900 ml-56 min-h-screen p-4">
  <div class="grid grid-cols-2 my-1 text-white items-center mb-2">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}>{title || "New Page"}</h1>
    <button on:click={saveNote} class=" font-semibold ml-auto  rounded-lg hover:bg-red-700 hover:text-white px-5 py-2 bg-white text-black">Save</button>
  </div>
  <hr/>
  <div class="flex flex-col space-y-4 mx-auto py-6">
    <textarea class="rounded-lg text-gray-900 bg-gray-100 border border-gray-300 p-2" 
      bind:value={note}
    ></textarea>
  </div>
</main>

<style>
  
</style>
