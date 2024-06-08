<script>
  import{onMount} from 'svelte';
  let Pages=[];
  let currentPageIndex=0;
  let title='';
  let note='';
  onMount(() => {
    const savedPages=localStorage.getItem("pages")
   if(savedPages)
   {
    Pages=JSON.parse(savedPages);
    title=Pages[currentPageIndex];
    note=localStorage.getItem(title);
   }
   else{
      addPage();
   }
  })
  function selectNote(index){
    currentPageIndex=index;
    title=Pages[currentPageIndex];
    note=localStorage.getItem(title);
  }
  function saveNote()
  {
    const storedPageName=Pages[currentPageIndex];
    if (storedPageName!=title) {
      localStorage.removeItem(storedPageName);
      Pages[currentPageIndex]=title;
    }
    localStorage.setItem(title,note);
  localStorage.setItem('pages',JSON.stringify(Pages));
  }
  function addPage()
  {
    Pages.push("New Note")
    selectNote(Pages.length?Pages.length-1:0);
  }
  function deleteNote(index) {
  const deletedTitle = Pages[index];
  Pages.splice(index, 1);
  localStorage.removeItem(deletedTitle);
  localStorage.setItem('pages', JSON.stringify(Pages));
  if (index === currentPageIndex) {
    if (Pages.length > 0) {
      const nextIndex = index < Pages.length ? index : index - 1;
      selectNote(nextIndex);
    } else {
      currentPageIndex = 0;
      title = '';
      note = '';
    }
  }
}


</script>

<aside class="fixed top-0 left-0 z-40 h-screen w-60">
<div class="bg-skin overflow-y-auto py-5 px-4 h-full border-r border-gray-200">
  <ul class="space-y-2">
    {#each Pages as Page,index}
    <li>
      <button on:click={()=> selectNote(index)} class="{index==currentPageIndex?'bg-lightblue':''} py-2 px-4 rounded-lg">{Page}</button>
      <button on:click={() => deleteNote(index)} class="ml-2 bg-red-500 text-white py-2 px-2 rounded-lg">Delete</button>
    </li>
    {/each}
    <li class="text-center"><button class="font-medium " on:click={addPage}> + Add Page</button></li>
  </ul>
</div>
</aside>
<main class="p-4 ml-60 h-auto bg-blue h-full">
  <div class="grid grid-cols-2 items-center mb-2.5 rounded-lg bg-black">
    <h1 class="ml-2.5 text-2xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-6 py-4 rounded-lg font-medium text-small mt-2.5 p-right-4"  on:click={saveNote}>Save</button>
  </div>
<hr>
  <textarea class="mt-2.5 block w-full bg-gray-50 bg-gray-400 text-gray-800 rounded-lg p-2.5 height-400px" bind:value={note}></textarea>
 
</main>

<style>

  .height-400px{
    height: 400px;
  }
  .p-right-4{
    margin-right: 10px;
    margin-bottom: 10px;
  }  .bg-black{
    background: #83B4FF;
  }
.bg-skin{
  background-color: #FCFFE7;
}
.bg-lightblue{
  background: #BAD7E9;
}
</style>