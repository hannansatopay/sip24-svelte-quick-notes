<script>
  // let name = 'Tanay' + ' Sama';
  import { onMount } from "svelte";
  
  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = '';

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    
    if(savedPages){
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex] || "New Page";
      note = localStorage.getItem(title);
    }else{
      addPage();
    }
  })

  function saveNote(){
    // console.log(title, '\n\r' ,note);
    // localStorage.setItem('title', title);
    // localStorage.setItem('note', note);

    const storedPageName = pages[currentPageIndex];

    if(storedPageName != title){
      localStorage.removeItem(storedPageName);
    }

    pages[currentPageIndex] = title;
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage(){
    pages.push("New Page");
    selectPage(pages.length? pages.length - 1 : 0);
  }

  function selectPage(index){
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }

  function deletePage(index){
    currentPageIndex = index;
    pages.splice(currentPageIndex, 1);
    localStorage.removeItem(title);

    if(currentPageIndex > 0){
      currentPageIndex = index === 0 ? 0 : index - 1;
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    }else{
      currentPageIndex = 0;
      addPage();
    }

    localStorage.setItem("pages", JSON.stringify(pages));
  }

</script>


<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-y-auto border-r-2 border-gray-800 py-5 px-3 h-full">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button class="{index == currentPageIndex ? 'bg-dark-gray' : " "} font-medium text-gray-900 py-2 px-3 rounded-lg" on:click={()=>selectPage(index)}>{page}</button>
      </li>
      {/each}
      
      <li class="text-center">
        <button class="font-medium" on:click={addPage}>+Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="ml-60 bg-cool-color p-4 h-screen bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500"> <!-- border-2 border-gray-600 -->
  <!-- <h1>Hello Guys, <em>{name}</em> here!</h1> -->
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}>{title || "New Page"}</h1>
    <button class="ml-auto bg-gray-800 border-2 border-gray-800 font-medium rounded-lg px-5 py-2.5 text-sm mt-3 text-gray-100 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>

  <hr/>

  <!-- <input class="block w-full rounded-xl text-gray-900 border border-gray-300 bg-gray-100 p-2.5 text-center font-bold" type="text" bind:value={title} placeholder="Add a title"> -->
  
  <textarea class="block w-full rounded-lg text-gray-900 border-gray-300 bg-gray-50 font-normal p-2.5 mt-3" bind:value={note}></textarea>
  <button class="ml-auto bg-gray-800 border-2 border-gray-800 font-medium rounded-lg px-5 py-2.5 text-sm mt-3 text-gray-100 hover:bg-gray-900" on:click={()=>deletePage(currentPageIndex)}>Delete the current page</button> 
  
</main>


<style>
  .bg-light-gray{
    background: rgb(251, 251, 251);
  }
  
  .bg-dark-gray{
    background: rgb(240, 240, 240);
  }

  .bg-cool-color {
    /* background: rgb(190, 136, 200); */
  }
</style>