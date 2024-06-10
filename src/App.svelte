<script>
import{onMount} from 'svelte';
let pages=[];
let currentpageindex=0;
let title='';
let note='';
 onMount(()=> {
  const savedpages=localStorage.getItem("pages");
  if(savedpages){
  pages=JSON.parse(savedpages);    
  title=pages[currentpageindex];
  note=localStorage.getItem(title);
} else {
addPage();
  }
});
 function savenote(){
  const storedpagename=pages[currentpageindex];
  if(storedpagename!=title)
  {
    localStorage.removeItem(storedpagename);
  pages[currentpageindex]=title;
  }
  localStorage.setItem(title,note);
  localStorage.setItem("pages",JSON.stringify(pages));
}
function addPage(){
  pages.push("New Page");
  selectpage(pages.length?pages.length - 1 : 0 );
}
function selectpage(index){
currentpageindex=index;
title=pages[currentpageindex];
note=localStorage.getItem(title);
}
</script>
<aside class="fixed top-0 left-0 z-40 w-60 h-screen  ">
  <div class="bg-blue-400 overflow-y-auto py-5 px-10  h-full border-r border-gray-200">
    <ul class="space-y-2 x-2">
    {#each pages as page,index}
     <li>   
      <button on:click ={()=>selectpage(index)} class="{index== currentpageindex ?'':''}bg-yellow-400 py-2 px-3 text-gray-900 rounded-lg">{page}</button>
     </li>
    {/each}
    <li class="text-center font-medium"><button on:click={addPage}>+ Add page</button></li>
    </ul>
  </div>
</aside>
<main class="p-9 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
 <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
 <button class=" ml-auto px-5 py-5 m-4 text-white bg-red-800 px-0 rounded-lg font-large hover:bg-yellow-400 mt-4 text-sm"on:click={savenote}>SAVE</button>
</div>
<hr/>
 <textarea bind:value={note} class="block w-full bg-gray-50 mt-5 border-gray-400 rounded-lg font-medium text-gray-900 p-2.5"></textarea>
</main>

<style>
.bg-dark-gray{
  background:red;
}
.bg-light-gray{
  background-color:whitesmoke;
}
</style>    