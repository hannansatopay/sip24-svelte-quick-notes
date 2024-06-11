<script lang="ts">
  import { onMount} from 'svelte';
  import {
    addPage,
    deletePage,
    getAllPages,
    getPage,
    openDB,
    updatePage,
  } from "./db";

  let pages =[];
  let currentPageIndex = 0;
   let title = '';
   let note = '';

   onMount(async () => {
    await openDB();
    const savedPages = await getAllPages();
    if (savedPages.length > 0) {
      pages = savedPages.map((page) => page.title);
      currentPageIndex = 0;
      title = pages[currentPageIndex];
      note = (await getPage(title))?.note || "";
    } else {
      handleAddPage();
    }
  });
  
  const handleSavePage = async () => {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await deletePage(storedPageName);
      pages[currentPageIndex] = title;
    }
    await updatePage(title, note);
  };
  const handleDeletePage = async () => {
    const currentPage = pages[currentPageIndex];
    await deletePage(currentPage);
    pages = pages.filter((page) => page !== currentPage);
    if (pages.length > 0) {
      handleSelectPage(0);
    } else {
      title = "";
      note = "";
      currentPageIndex = 0;
    }
  };
  function handleAddPage() {
    const newPageTitle = "New Page";
    pages = [...pages, newPageTitle];
    handleSelectPage(pages.length - 1);
    addPage(newPageTitle, "");
  }
  const handleSelectPage = async (index: number) => {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = (await getPage(title))?.note || "";
  };
  

</script>
<div  class="wrapper">
<aside class=" fixed top-0 left-0 z-40 w-60 h-screen text-color">
  <div class="bg-color overflow-y-auto py-5 px-3 h-full border-r  text-color">
    <ul class="space-y-2 text-color">
      {#each pages as page, index}
        <li>
          <button on:click={() => handleSelectPage(index)} class="{index == currentPageIndex ? 'bg-brown' : ''} py-2 px-3  rounded-lg">{page}</button>
        </li>
      {/each}  
        <li class="text-center">
          <button on:click={handleAddPage} class="font-medium text-sm mt-3 ml-auto px-5 py-2.5 btn shadow-[0_9px_0_rgb(51,0,0)] hover:shadow-[0_4px_0px_rgb(51,0,0)] bg-white ease-out hover:translate-y-1 transition-all rounded-lg flex justify-center items-center text-color"> +Add page</button>
        </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto bg-brown  overflow-y-auto overflow-x-hidden ">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl mb-4 p-2 font-bold text-color" contenteditable bind:textContent={title}></h1>
    <div class="flex space-x-4">
    <button class="font-medium text-sm ml-auto  px-5 py-2.5 mt-3 btn shadow-[0_9px_0_rgb(51,0,0)] hover:shadow-[0_4px_0px_rgb(51,0,0)] bg-white ease-out hover:translate-y-1 transition-all rounded-lg flex justify-center items-center text-color" on:click={handleSavePage}>Save</button>
    <button class="font-medium text-sm  px-5 py-2.5 mt-3 btn shadow-[0_9px_0_rgb(51,0,0)] hover:shadow-[0_4px_0px_rgb(51,0,0)] bg-white ease-out hover:translate-y-1 transition-all rounded-lg flex justify-center items-center text-color" on:click={handleDeletePage}>Delete</button>
    </div>

  </div>
  <hr/>
  
  <textarea class="block w-full h-64 p-4 mt-3 bg-gray-50 border border-gray-300 rounded-lg text-color  " bind:value={note}></textarea>
</main>

<footer>
  <div class="container">
    <div class="footer-wrapper">
          <div class="footer-faded-text">@KaberiManjari</div>
    </div>
 </div>
</footer>
</div>


<style>
  .bg-brown{
    background-color: #F9DF8B;
  }
  .text-color{
    color: #502600;
  }
  .bg-color{
    background-color: #EBBF56;
  }
  .container{
    width: 1200px;
    margin: 0 auto;

}
.wrapper{
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
}
.footer-wrapper{
    display: flex;
    gap: 1rem;
    padding: 1.2rem;
    justify-content: space-between;
    align-items: center;
}
.footer-faded-text{
    position: absolute;
    left: 50;
    margin: 80px;
    color: #c8c7c6cd;
    user-select: none;
    font-size: 2em;

}
</style>
