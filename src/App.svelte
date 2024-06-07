<script>
  import {onMount} from 'svelte';

 let page = [];
 let currentpageindex=0
 let title='';
 let note='';

onMount(() => {
  const savedpages = localStorage.getItem("pages");
  if (savedpages) {
    page = JSON.parse(savedpages);
    title= page[currentpageindex];
    note=localStorage.getItem(title);

  } else{
    addPage();
  }

});
function savenote(){
const storedprogramName = page[currentpageindex];
if (storedprogramName != title){
  localStorage.removeItem(storedprogramName);
  page[currentpageindex] = title;
}
 page [currentpageindex] = title;
 localStorage.setItem(title, note);
 localStorage.setItem("page",JSON.stringify(page));
}
function addPage() {
  page.push("new page");
  selectpage(page.length ? page.length -1 :0);
}

function selectpage(index) {
  currentpageindex=index;
  title=page[currentpageindex];
  note=localStorage.getItem(title);
}

</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      
        {#each page as page, index}
        <li>
          <button on:click={()=>selectpage(index)} class="{index == currentpageindex ? 'bg-dark-gray' : ''}  py-2 px-3 text-gray-900 rounded-lg">{page}</button>
        </li>
          {/each} 
       <li class="text-center"><button on:click={addPage} class="font-medium">+Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3 ">
    <h1 class ="text-3xl font-bold" contenteditable bind:textContent={title }></h1>
    
  </div>
  <hr/> 

 
 <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"bind:value={note}></textarea>
 <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font font-medium text-sm mt-3 hover:bg-gray-900"on:click={savenote}>save</button>
</main>

<style>
.bg-light-gray {
  background: #fbfbfb;
}

</style>