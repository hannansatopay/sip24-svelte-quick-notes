<script>
  import { onMount } from "svelte";
    import { parse } from "svelte/compiler";
  let title = "";
  let note = "";
  let pages = [];
  let currentPageIndex = 0;
  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if(savedPages){
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    }else{
      addPage();
    }

  });
  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if(storedPageName != title){
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }
  function addPage(){
    pages.push("new Page");
    selectPage(pages.length ? pages.length-1 : 0);
  }
  function selectPage(index){
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }
  function removeTitle(index){
    currentPageIndex = index;
    pages[currentPageIndex] = title;
    pages.splice(currentPageIndex, 1);
    localStorage.removeItem(pages[currentPageIndex]);
    if(currentPageIndex >= pages.length){
      currentPageIndex = pages.length - 1;
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div
    class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200"
  >
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button on:click={()=>selectPage(index)} class="{index === currentPageIndex ? "bg-dark-gray" : ""} py-2 px-3 text-gray-900 rounded-lg"
            >{page}</button
          >
          <button class="border border-gray-300 bg-gray-200 rounded-full h-6 w-6 flex items-center justify-center ml-2 text-gray-500" on:click={() => removeTitle(index)}>X</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+Add Button</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1
      class="text-3xl font-bold"
      contenteditable
      bind:textContent={title}
    ></h1>
    <button
      class="ml-auto bg-gray-800 text-white rounded-lg px-5 py-2.5 font-medium text-sm mt-3 hover:bg-gray-900"
      on:click={saveNote}>Save</button
    >
  </div>
  <textarea
    class=" mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={note}
  ></textarea>
</main>

<style>
  .bg-light-gray {
    background-color: #fbfbfb;
  }
  .bg-dark-gray {
    background-color: #efefef;
  }
</style>
