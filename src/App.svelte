<script>
  import {onMount} from 'svelte'
  
  let pages = []
  let currentPageIndex = 0
  let title = ''
  let note = ''

  onMount(()=>{
    const savedPages = localStorage.getItem("pages")
    if (savedPages) {
      pages = JSON.parse(savedPages)
      title = pages[currentPageIndex]
      note = localStorage.getItem(title)
    }else {
      addPage()
    }
  })

  function saveNote(){
    const storedPageName = pages[currentPageIndex]
    if(storedPageName != title){
      localStorage.removeItem(storedPageName)
      pages[currentPageIndex] = title
    }
    localStorage.setItem(title, note || '')
    localStorage.setItem("pages", JSON.stringify(pages))
  }

  function addPage() {
    pages.push('New Page')
    selectPage(pages.length ? pages.length-1 : 0)
  }

  function selectPage(index){
    currentPageIndex = index
    title = pages[currentPageIndex]
    note = localStorage.getItem(title)
  }

  function deletePage(index){
    const pageTitle = pages[index]
    pages.splice(index, 1)
    localStorage.removeItem(pageTitle)

    if (currentPageIndex >= index) {
      currentPageIndex--;
    }

    if(pages.length > 0) {
      title = pages[currentPageIndex]
      note = localStorage.getItem(title)
    } else {
      title = ''
      note = ''
    }

    localStorage.setItem("pages", JSON.stringify(pages))
    pages = pages //re-render the pages
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-gray-200" >
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="grid grid-cols-2 items-center mb-3">
          <button on:click={()=>selectPage(index)} class="{index == currentPageIndex && 'bg-dark-gray'} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
          <button>
            <svg on:click={()=>deletePage(index)} class="ml-4 my-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...$$props}>
              <path fill="#c03030" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" />
            </svg>
          </button>
        </li>
      {/each}
      <li class="text-center hover:text-gray-800">
        <button class="font-medium" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr>
  <textarea class="mt-4 block w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5" bind:value={note} name="note" placeholder="Take a note..."></textarea>
</main>

<style>
  .bg-light-gray {
    background-color: rgb(240, 240, 240);
  }

  .bg-dark-gray {
    background-color: rgb(219, 219, 219);
  }

  .my-svg:hover {
   height: 26px;
   width: 26px;
  }
</style>