<script>
  import { onMount } from "svelte";
  let title= "";
  let note="";
  let pages=[];
  let currentPageIndex=0;

  onMount(()=>{
    const savedPages= localStorage.getItem("pages");
    if (savedPages)
    {
      pages= JSON.parse(savedPages)
      title=pages[currentPageIndex]
      note= localStorage.getItem(title)
    }
    else
    {
      createNote();
    }
  })

  function saveNote()
      {
        
      const storedPageName= pages[currentPageIndex]
      if(storedPageName!=title)
      {
        localStorage.removeItem(storedPageName)
        pages[currentPageIndex]=title
      }
      localStorage.setItem(title, note)
      localStorage.setItem("pages", JSON.stringify(pages))
      }

  function createNote()
      {
        pages.push("new note");
        selectNote(pages.length ? pages.length-1 : 0)
      }

  function selectNote(index){
    currentPageIndex=index;
    title=pages[currentPageIndex];
    note=localStorage.getItem(title)
  }

  async function deleteNote(){

    localStorage.removeItem(pages[currentPageIndex])
    localStorage.removeItem(title)
    pages.splice(currentPageIndex,1)
    localStorage.setItem("pages", JSON.stringify(pages))
    selectNote(pages.length ? pages.length-1 : 0)
  }
  

</script>
   
<aside class="fixed top-0 left-0 width-60 max-w-min  h-screen">
  <div class="bg-blue-50 overflow-y-auto px-3 py-5 h-full border-r">
    <ul class="space-y-2">
      {#each pages as page, index }
      <li>
        <button on:click={()=>selectNote(index)} class="{index == currentPageIndex ? 'bg-blue-300 shadow-md shadow-gray' :'' } py-2.5 px-4 bg-blue-200 text-gray-800 border border-blue-300 mv-2 mh-4 rounded-lg font-medium mt-5 hover:bg-blue-300 hover:shadow-md hover:shadow-gray">
          {page}
        </button>
      </li>
      {/each}
      <li class="text-center">
        <button on:click={createNote} class="font-medium">
          +Add Note
        </button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-3 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}>
      {title || "Note Title"}
    </h1>
    <button class="py-2.5 px-4 ml-auto bg-sky-950 text-sky-100 mv-2 mh-4 margin-auto rounded-lg font-medium mt-5 hover:bg-sky-800 hover:shadow-md hover:shadow-gray" on:click={saveNote}>+</button>
  </div>
  <hr/>
  
  <textarea class="block w-full mt-3 bg-blue-50 border border-blue-200 rounded-lg text-sky-900 font-sans;" bind:value={note}></textarea>
  <button class="py-2.5 px-4 ml-auto bg-sky-950 text-sky-100 mv-2 mh-4 margin-auto rounded-lg font-medium mt-5 float-right hover:bg-sky-800 hover:shadow-md hover:shadow-gray" on:click={deleteNote} >
    -
  </button>

</main>

<style>
  

</style>