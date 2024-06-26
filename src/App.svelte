<script>
  import { onMount } from 'svelte';
let pages=[];
let currentPageIndex=0;
let title = '';
let note = '';

 let name="Sumaiya Memon";
 
 onMount(()=>{
 const savedPages= localStorage.getItem("pages");
 if(savedPages){
  pages=JSON.parse(savedPages);
  title=pages[currentPageIndex];
  note=localStorage.getItem(title);
 }
 else{
  addpage();
 }
});

 function savenote(){
  const storedPageName =  pages[currentPageIndex];
  if(storedPageName!= title){
    localStorage.removeItem(storedPageName);
    pages[currentPageIndex]=title;
  }
  
  localStorage.setItem(title,note);
  localStorage.setItem("pages",JSON.stringify(pages));
 }
 function addpage(){
 pages.push("new page");
 selectPage(pages.length ? pages.length-1 : 0)
 }
 function selectPage(index){
  currentPageIndex=index;
  title=pages[currentPageIndex];
  note=localStorage.getItem(title);
 }
 function deletePage(index) {
    localStorage.removeItem(pages[index]); 
    pages.splice(index, 1); 
    currentPageIndex = Math.max(0, currentPageIndex - 1); 
    localStorage.setItem("pages", JSON.stringify(pages)); 
    if (pages.length === 0) addpage(); 
    else selectPage(currentPageIndex); 
  }
</script>
<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
<div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
  <ul class="space-y-2">
    {#each pages as page,index}
    <li>
      
      <button on:click={()=>selectPage(index)} class=" {
      index== currentPageIndex ? 'bg-light-blue' : ''} py-2 px-3 text-violet-900 rounded-lg">{page}</button>
      <button 
      on:click={() => deletePage(index)} 
      class="ml-2 text-red-500 hover:text-red-700">
      &times;
    </button>

    </li>{/each}
    <li class="text-center text-green-900 bg-gray py-1 px-3 rounded-lg"><button on:click={addpage} class="font-medium">+Add Page</button>
    </li>
  </ul>
</div>
</aside>

  <main class="p-4 ml-60 h-auto">
    <div class="grid grid-cols-2 items-center mb-3">
      <h1 class="text-2xl font-bold text-blue-900" contenteditable bind:textContent={title}></h1>
      <button class="ml-auto bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-500"on:click={savenote} >Save</button>
    </div>
    <hr/>
<h6 class="text-indigo-600 mb-4">Hello, my name is {name}</h6>

<textarea 

class="mt-3 w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-600 text-violet-900">
</textarea>

</main>

<style>
h6{
  color:rgb(48, 42, 165);
}
.bg-light-blue{
  background:hwb(188 60% 22%)
}   
</style>