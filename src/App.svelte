<script>
  import { Pages } from "@mui/icons-material";
    import { onMount } from "svelte"; 

    let pages = [];
    let currentPageIndex = 0;
    let title = 'New Note';
    let note = 'Today is an excellent day!';
    onMount(()=>{
      title = localStorage.getItem('title');
      note = localStorage.getItem('note');
    })
    function saveNote(){
      console.log(title,note);
      localStorage.setItem('title',title);
      localStorage.setItem('note',note);
    }
    function addPage(){
      pages.push("New Page");
      pages = pages;
    }
</script>
<aside class="fixed top-0 left-0 w-60 h-screen">
   <div class="bg-light-grayoverflow-y-auto py-5 px-3 h-full border-r border-gray-200">
      <ul class="space-y-2">
         <li>
            {#each pages as page, index}
            <button class="bg-dark-gray py-2 px-3 text-gray-900 rounded-lg">{page}</button>
            {/each}
             
         </li>
         <li class="text-center"><button on:click={addPage} class="font-medium">+ Add Page</button></li>
      </ul>
   </div>
</aside>

<main class="p-4 ml-60 h-auto">
   <div class="grid grid-cols-2 items-center mb-3">
      <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
      <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
   </div>
   <hr/>
   <!-- <input class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={title} type="text"  > -->

   <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
   <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
</main> 

<style>
.bg-light-gray{
   background: #fbfbfb;
}
.bg-dark-gray{
   background: #efefef;
}
</style>