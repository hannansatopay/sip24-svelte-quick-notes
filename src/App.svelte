<script>
  import { onMount } from "svelte";

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(() => {
    const savePages = localStorage.getItem("pages");
    if(savePages){
      pages = JSON.parse(savePages);
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    }
    else{
      addPage();
    }
  });

  function saveNote()
  {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title)
    {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    localStorage.setItem(title,note);
    localStorage.setItem("pages",JSON.stringify(pages))
  }

  function addPage()
  {
    pages.push("New Page");
    selectedPage(pages.length ? pages.length-1 : 0);
  }

  function selectedPage(index){
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }

</script>

<aside class ="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class ="overfow-y-auto h-full border-r border-gray-300 p-3">
    <ul class ="space-y-2">
      {#each pages as page,index}
      <li>
        <button on:click={()=> selectedPage(index)} class="{index == currentPageIndex? 'bg-gray-600': ''} font-bold bg-black text-white p-3 rounded-lg">{page}</button>
      </li>
      {/each}
      
      <li class="text-center"><button class="font-medium" on:click={addPage}>+Add Page</button></li>
    </ul>
  </div>

</aside>

<main class=" p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center">
    <h1 class="text-3xl font-bold py-2 px-3 rounded-lg" contenteditable bind:textContent={title}></h1>
    <button class="text-xl font-bold mb-3 ml-auto block rounded-lg bg-black px-2 py-1 mt-4 text-white hover:bg-gray-600" on:click={saveNote}>Save</button>
  </div>
  <hr/>
<textarea class = "block w-full mt-4 bg-black text-white rounded-lg" bind:value={note}></textarea>
</main>

<style>

</style>