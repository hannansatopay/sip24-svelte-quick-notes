<script>
  import {onMount} from 'svelte'

  let pages = [];
  let currentPageIndex = 0;
  let title = ''
  let note = ''

  onMount(()=>{
    const savedPages = localStorage.getItem("pages")
    if(savedPages){
      pages = JSON.parse(savedPages)
      title = pages[currentPageIndex]
      note = localStorage.getItem(title)
    }else{
      addPage()
    }

  })

  function addPage(){
    pages.push("New Page")
    pages = pages
    selectPage(pages.length ? pages.length-1 : 0)
  }
 
  function saveNote(){
    const storedPages = pages[currentPageIndex]
    if(storedPages != title){
      localStorage.removeItem(storedPages)
      pages[currentPageIndex] = title
    }
    localStorage.setItem(title,note)
    localStorage.setItem("pages",JSON.stringify(pages))
  }

  function selectPage(index){
    currentPageIndex=index
    title = pages[currentPageIndex]
    note = localStorage.getItem(title)
  }

  function removeNote(){
    const currentPage = pages[currentPageIndex]
    localStorage.removeItem(currentPage)
    pages.splice(currentPageIndex,1)
    localStorage.setItem("pages",JSON.stringify(pages))
    if(currentPageIndex > 0){
      currentPageIndex -=1
      title = pages[currentPageIndex]
      note = localStorage.getItem(title)
      }else{
        addPage()
      }
    // console.log(pages)
    
  }
</script>

<aside class="fixed top-0 w-60 left-0 h-screen ">
  <div class="bg-light-gray py-5 px-2.5 overflow-y-auto h-full borer-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index }
        <li><button on:click={()=>selectPage(index)} class="{index==currentPageIndex ? "bg-dark-gray" : ''} text-gray-900 rounded-lg px-2 py-3">{page}</button></li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+Add Page</button></li>
      
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto">
      <button on:click={removeNote} class="bg-white-700 hover:bg-red-100 text-red-600 text-size-sm border border-red-400 rounded-lg px-5 py-2.5 mt-3 ">Delete</button>
      <button on:click={saveNote} class="bg-gray-700 hover:bg-gray-900 text-white text-size-sm rounded-lg px-5 py-2.5 mt-3 ">Save</button>
    </div>

  </div>
  <hr/>
  <textarea class="block w-full border border-gray-300 bg-gray-50 rounded-lg p-2 mt-3" bind:value={note} placeholder="enter your note"></textarea>

</main>

<style>
  .bg-light-gray{
    background:#FBFBFB;
  }
  .bg-dark-gray{
    background: #efefef;
  }

</style>