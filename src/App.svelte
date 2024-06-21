<script>
  import { onMount } from 'svelte'
  //var,let,const--> variables;
  let title = "";
  let note = "";
  let pages = [];
  let currPage =0;
  onMount(()=>{
    const savedPages = localStorage.getItem("pages")
    if(savedPages){
      pages = JSON.parse(savedPages);
      title = pages[currPage];
      note = localStorage.getItem(title);
    }else{
      addPage();
    }
  })
  
  function saveNote(){
    const savedcurrpage = pages[currPage];
    if(savedcurrpage!=title){
      localStorage.removeItem(savedcurrpage);
      pages[currPage] = title;
    }
    localStorage.setItem(title,note);
    localStorage.setItem("pages",JSON.stringify(pages));
  }
  function addPage(){
    pages.push("New Page");
    selectPage(pages.length ? pages.length-1:0);
  }
  function deletePage(index) {
    if (pages.length > 0) {
      // Remove the current page title from local storage
      localStorage.removeItem(pages[currPage]);
      // Remove the current page from the pages array
      pages.splice(currPage, 1);
      // Update the pages in local storage
      localStorage.setItem("pages", JSON.stringify(pages));

      if (pages.length > 0) {
        if (currPage >= pages.length) {
          currPage = pages.length-1;
        }
        title = pages[currPage];
        note = localStorage.getItem(title) || "";
      }else {
        title = "";
        note = "";
        currPage = 0;
      }
    }
  }
  function selectPage(index){
    currPage=index;
    title = pages[currPage];
    note = localStorage.getItem(title);
  }
</script>

<aside class ="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class ="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-400">
    <ul class="space-y-2">
      {#each pages as page, index}
       <li>
         <button on:click={()=>selectPage(index)} class="text-left py-2 px-3 border border-gray-500 w-full bg-gray-50 rounded-lg {index == currPage ? 'bg-gray-500': ''} ">{page}</button>
       </li>
      {/each}   
      <li class = "text-center bg-gray-900 text-white rounded-lg p-2 hover:bg-white hover:text-gray-800 hover:border border-gray-800"><button on:click={addPage} class="font-medium">Add Pages</button></li>   
    </ul>
  </div>
</aside>

<main class="ml-60 h-auto p-4">
  <h1 class="font-bold text-3xl " contenteditable bind:textContent={title}>{title || "New Day"}</h1>
  <!-- <input class="block w-full bg-gray-50 rounded-lg p-2 text-gray-500" bind:value={title} type='text' placeholder="Add title"> -->
  <textarea class ="w-full bg-gray-50 rounded-lg mt-3 p-2 text-gray-500" bind:value={note}></textarea>
  <button class ="bg-gray-800 px-2 py-1 rounded-lg mt-1.5 text-white hover:bg-white hover:text-gray-800 hover:border border-gray-800" on:click={saveNote}>Save</button>
  <button on:click={deletePage} class="ml-2 text-red-600 hover:text-red-800">delete</button>
</main>

<style>

</style>