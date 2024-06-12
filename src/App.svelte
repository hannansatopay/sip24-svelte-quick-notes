<script>
import { onMount} from 'svelte';
onMount(() => {
 const savedPages = localStorage.getItem("pages");
 if(savedPages){
  pages = JSON.parse(savedPages);
  title = pages[currentPageIndex];
  note = localStorage.getItem(title);
 }else{
  addPage();
 }
} )
 let title = '';
 let note = '';
 let pages = [];
 let currentPageIndex = 0;

 function saveNote(){
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
  selectPage(pages.length ? pages.length-1:0)
 }
 function selectPage(index){
  currentPageIndex = index;
  title = pages[currentPageIndex];
  note = localStorage.getItem(title);
 }
</script>
<aside class = "fixed top-0 left-0 z-40 w-60 h-screen">
  <div class = "bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class = "space-y-2">
        {#each pages as page,index}
          <li>
            <button class = "{index == currentPageIndex? 'bg-dark-gray': ''} py-2 px-3 text-gray-900 rounded-lg" on:click={()=> selectPage(index)}>{page}</button>
          </li>
        {/each}

      <li><button class ="font-medium" on:click={addPage}>+Add Page</button></li>
    </ul>
  </div>
</aside>
<main class = "p-4 ml-60 h-auto">
 <div class = "grid grid-cols-2 items-center mb-3">
  <h1 class = " text-3xl font-bold" contenteditable bind:textContent={title}></h1>
  <button class = "ml-auto mt-5 block  bg-gray-200 border border-gray-1500 rounded-lg text black-1000 p-1.5 font-medium hover:bg-gray-500" on:click={saveNote}>Save</button>
 </div>
 <hr/>
 <input class = "block w-full bg-gray-50 border border-gray-300 rounded-lg text gray-900 p-2.5" bind:value={title} type = "text" placeholder="Add text">
 <textarea bind:value={note} class = "mt-3 block w-full bg-gray-200 border border-gray-1500 rounded-lg text black-1000 p-2.5" placeholder="Add Note"></textarea>

</main>


<style>
  .bg-light-gray {
    background: #FBFBFB;
  }
  .bg-dark-gray{
    background: #EFEFEF;
  }

</style>