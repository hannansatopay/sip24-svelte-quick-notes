<script>
  import { onMount } from "svelte";

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  onMount(() => {
    const savedPages = localStorage.getItem("Pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      currentPageIndex = parseInt(localStorage.getItem("CurrentPageIndex")) || 0;
      title = pages[currentPageIndex];
      note = localStorage.getItem(title) || "";
    } else {
      addPage();
    }
  });

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
      localStorage.setItem("Pages", JSON.stringify(pages));
    }
    localStorage.setItem(title, note);
    localStorage.setItem("CurrentPageIndex", currentPageIndex.toString());
  }

  function addPage() {
    pages.push("New page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || "";
  }

  function deletePage() {
    if (pages.length > 1) {
      pages.splice(currentPageIndex, 1);
      if (currentPageIndex > pages.length - 1) {
        selectPage(pages.length - 1);
      } else {
        selectPage(currentPageIndex);
      }
      saveNote();
    }
  }
</script>
<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-violet overflow-y-auto px-3 py-5 h-full border-r border-gray-200 ">
    <ul class="space-y-2">
      {#each pages as page,indexS}
      <li>
         <button on:click={()=> selectPage(indexS)} class="{indexS == currentPageIndex?'bg-dark-gray':''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium bg-gray-900 hover:bg-gray-800">+Add Page</button></li>
      <li class="text-center"><button on:click={deletePage} class="font-medium bg-gray-900 hover:bg-gray-800">-Delete Page</button></li>
    </ul>
  </div>
</aside>

<main class=" main p-6 ml-60 ">
  <div class="grid grid-cols-2 items-center">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 mb-3 hover:bg-gray-900"on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <textarea class="mt-3 block w-full border border-gray-500 rounded-lg text-gray-900 p-2.5"bind:value={note}></textarea>
</main>


<style>
.bg-light-violet{
  background:#FFB22C;
}
.bg-dark-gray{
  background:#FFDE4D;
}
.font-medium{
  height: 30px;
  width: 120px;
  border-radius:10px;
  border: 1px black solid;
 padding: 2px;
  color: white;

}

</style>

