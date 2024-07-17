<script>
    import { onMount } from "svelte";

  let title = '';
  let text = '';
  let pages = [];
  let currentPageIndex = 0;

  function addPage(){
    pages.push("new page")
    selectPage(pages.length ? pages.length - 1 : 0)
  }

  function deleteNote(title){
    localStorage.removeItem(title)
    pages.splice(pages.indexOf(title),1)
    pages = pages
    localStorage.setItem('pages', JSON.stringify(pages))
  }

  function saveNote(){
    const storePageName = pages[currentPageIndex]
    if(storePageName != title){
      localStorage.removeItem(storePageName)
      pages[currentPageIndex] = title
    }
    pages[currentPageIndex] = title;
    localStorage.setItem(title, text)
    localStorage.setItem('pages', JSON.stringify(pages))
  }

  function selectPage(index){
    currentPageIndex = index
    title = pages[currentPageIndex]
    text = localStorage.getItem(title)
  }

  onMount(() => {
    const savedPages = localStorage.getItem('pages')
    
    if (savedPages){
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex] || "new page"
      text = localStorage.getItem(title)
    }
    else{
      addPage();
    }
  })

</script>

<aside class="fixed top-0 left-0 w-60 h-screen z-40">
  <div class="border-r overflow-y-auto py-5 px-3 h-full">
    <ul class="space-y-5">
      {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? "bg-gray-200" : ""} rounded px-4 py-1.5 border-black">{page || "new page"}</button>
      </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage}>+ add page</button>
      </li>
      
    </ul>
  </div>

</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}>{title || "new page"}</h1>
    <div class="ml-auto">
      <button class="rounded text-white bg-red-800 px-10 py-1 border border-black  hover:bg-gray-900" on:click={()=>deleteNote(title)}>delete</button>
      <button class="rounded text-white bg-blue-950 px-10 py-1 border border-black hover:bg-gray-900" on:click={saveNote}>save</button>
    </div>
  </div>
  <hr/>
  <!-- <input class="block w-full border rounded-lg p-2.5 mt-2" bind:value={title} type="Text"> -->
  <textarea class="block w-full mt-3 h-96 rounded-lg p-5" bind:value={text}></textarea>
</main>

<style>

</style>