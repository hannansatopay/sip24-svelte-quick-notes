<script>
  import {onMount} from 'svelte'
 let pages=[];
 let currentpageindex=0;
 let title = '';
 let note = '';
 onMount(()=>{
  const savedPages = localStorage.getItem("pages");
  if(savedPages){
    pages=JSON.parse(savedPages);
    title=pages[currentpageindex];
    note = localStorage.getItem(title);
  }
  else{
    addpage();
  }
 });
 function saveNote(){
  const storedpagename = pages[currentpageindex];
  if(storedpagename != title){
    localStorage.removeItem(storedpagename);
    pages[currentpageindex] = title;
    pages[currentpageindex]=title;
  }
  localStorage.setItem(title,note);
  localStorage.setItem("pages",JSON.stringify(pages));
 }
 function addpage(){
  pages.push("New Page");
  selectPage(pages.length ? pages.length-1 : 0);
 }

 function selectPage(index){
  currentpageindex=index;
  title = pages[currentpageindex];
  note = localStorage.getItem(title);
 }
</script>

<aside class = "fixed top-0 left-0 z-40 w-40 h-screen">
  <div>
    <ul class = "space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={()=>selectPage(index)} class = "{index == currentpageindex ? 'bg-gray-200' : ''} mt-2 py-2 py-3 text-gray-900 rounded-lg font-medium text-sm hover:bg-light-gray">{page}</button>
      </li>
      {/each}
      <li class = "text-center"><button on:click={addpage} class ="font-medium">+ADD PAGE</button></li>
    </ul>
  </div>
</aside>

<main class = "p-4 ml-60 h-auto">
  <div class = "grid grid-cols-2 items-center mb-3">
    <h1 class = "text-medium font-bold"contenteditable bind:textContent={title}></h1>
    <button  class = "mt-2 mb-3 ml-auto bg-gray-700 text-gray-50 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-900 "on:click={saveNote}>SAVE  </button>
  </div>
  <hr/>
  <textarea class = "mt-4 block w-full bg-gray-100 border border-gray-800 rounded-lg text-gray-900" bind:value={note}></textarea>
</main>