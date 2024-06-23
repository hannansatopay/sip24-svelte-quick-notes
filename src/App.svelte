<script>
  import {onMount} from 'svelte';

 let title="";
 let note="";
 let pages=[];
 let currentIndex =0;
 
onMount(()=>{
  const savedPages=localStorage.getItem("pages");
  if (savedPages){
    pages=JSON.parse(savedPages);
    title=pages[currentIndex];
    note=localStorage.getItem(title);
    
  }
  else{
    addPage();

  }

});

 function saveNote(){
  const storedtitle=pages[currentIndex];
  if(storedtitle != title){
    localStorage.removeItem(storedtitle);

    pages[currentIndex]=title;
  }
  localStorage.setItem( title,note);
  localStorage.setItem('pages', JSON.stringify(pages));
  


 }

 function addPage(){
  pages.push("New Page");
  selectPage(pages.length?pages.length-1:0)
 }

 function selectPage(index){
  currentIndex = index;
  title=pages[currentIndex];
  note=localStorage.getItem(title);

 }

</script>

<aside class="fixed top-0 left-0 w-60 h-screen z-40">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
  
      {#each pages as page,index}
    <li>
        <button class="{index == currentIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg " on:click={()=>selectPage(index)}>{page}</button>
      
      </li>
      {/each}
      <li class="text-center">
        <button class="font-medium" on:click={addPage}> +Add Page</button>
       
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
 <div class="grid grid-cols-2 items-center mb-3 ">
  <h1 class="text-3xl" contenteditable bind:textContent={title}></h1>
  <button class="bg-gray-800 text-white mt-3 ml-auto rounded font-small text-sm px-2 py-1 hover:bg-gray-900" on:click={saveNote}>Save</button>
  
 </div>
 <hr>
 <!-- <input class = "block w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-gray-900" bind:value={title} type='text' placeholder='Add title'> -->
 <textarea class="block mt-3 w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900" bind:value={note}></textarea>
 
</main>

<style>

.bg-light-gray{
  background: #FBFBFB;
}
.bg-dark-gray{
  background:#EFEFEF;
}
</style>