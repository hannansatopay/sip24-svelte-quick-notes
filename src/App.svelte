<script>

  import { onMount } from 'svelte'
  let pages=[]
  let currentpageindex=0
  let title=''
  let note=''

  onMount(()=>{
    const savedpages=localStorage.getItem("pages")
    if(savedpages){
      pages=JSON.parse(savedpages)
      title=pages[currentpageindex]
      note=localStorage.getItem(title)
    }
    else{
      addpage();
    }
    // title= localStorage.getItem('title')
    // note=localStorage.getItem('note')
  })
  function save(){
    const storedpagename= pages[currentpageindex]
    if(storedpagename!=title){
      localStorage.removeItem(storedpagename)
    pages[currentpageindex]=title
    }
    localStorage.setItem(title,note)
    localStorage.setItem("pages",JSON.stringify(pages))
  }
  function addpage(){
    pages.push("New Page")
    selectpage(pages.length ? pages.length-1:0)
  }
  function selectpage(index){
    currentpageindex=index
    title=pages[currentpageindex]
    note=localStorage.getItem(title)
  }
</script>
<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full boreder-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page,index}
    <li>
      <button on:click={()=>selectpage(index)} class="{index==currentpageindex ? 'bg-dark-gray': ''} rounded-lg py-2 px-3 text-gray-900">{page}</button>
      </li>
    {/each}
    <li class="text-center"><button on:click={addpage} class="font-medium">Add page</button></li>
  </ul>
</div>
</aside>
<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font bold " contenteditable bind:textContent={title}>{title || "New Page"}</h1>
    <button class=" ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={save}>Save</button>
  </div>
  <hr/>
   
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  <!-- <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={save}>Save</button> -->
</main>

<style>
  .bg-light-gray{
    background-color: rgb(232, 232, 232);
  }
  .bg-dark-gray{
    background-color: rgb(164, 162, 162);
  }
</style>