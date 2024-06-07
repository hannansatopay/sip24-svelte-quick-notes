<script>
  import { onMount } from "svelte";

  onMount(()=>{
    const savedPages = localStorage.getItem("pages");
    if(savedPages){
      pages = JSON.parse(savedPages);
      title = pages[currentIndex] || "New Page";
      note = localStorage.getItem(title);
    }else{
      addPage();
    }
    // title = localStorage.getItem('title');
    // note = localStorage.getItem('note');
  });
  // let name = "Maley";
  let pages = [];
  let currentIndex = 0;
  let title = '';
  let note = '';

  function saveNote(){
    // console.log(title,note);
    // localStorage.setItem('title',title);
    // localStorage.setItem('note',note);
    const storesPage = pages[currentIndex];
    if(storesPage != title){
      localStorage.removeItem(storesPage);
      pages[currentIndex] = title;
    }
    pages[currentIndex] = title;
    localStorage.setItem(note,title);
    localStorage.setItem("pages",JSON.stringify(pages));


  }
  function addPage(){
    pages.push("New Page")
    // pages = pages;
    selectPage(pages.length ? pages.length-1 : 0);
  }
  function deletePage(index) {
    const pageTitle = pages[index];
    localStorage.removeItem(pageTitle);
    pages.splice(index, 1);

    if (currentIndex === index) {
      currentIndex = pages.length ? 0 : -1;
      if (currentIndex >= 0) {
        selectPage(currentIndex);
      } else {
        title = '';
        note = '';
      }
    } else if (currentIndex > index) {
      currentIndex--;
    }
    localStorage.setItem("pages", JSON.stringify(pages));
  }
  function selectPage(index){
    currentIndex = index;
    title = pages[currentIndex];
    note = localStorage.getItem(title);
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page , index}
      <li>
        <button on:click={()=>selectPage(index)} class="{index == currentIndex ? 'bg-dark-gray': ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button> 
        <button on:click={() => deletePage(index)} class="ml-2 text-black-500">X</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+Add Page</button></li>
    </ul>
  </div>
</aside>
<main class="p-4 m-60 h-auto">
  <!-- Hello World , I am {name} -->
  <!-- <h1>This is Heading 1</h1>
  <h2>This is Heading 2</h2>
  <h3>This is Heading 3</h3>
  <h6>This is Heading 6</h6> -->
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm mt-3 hover:bg-gray-600" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <!-- <input class="block w-full bg-grey border border-grey-300 rounded-lg text-gray-900 p-2.5" bind:value={title} type='text'> -->
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  <!-- <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm mt-3 hover:bg-gray-600" on:click={saveNote}>Save</button> -->
</main>

<style>
/* h1{
  color:aquamarine;
}
h2{
  color:aqua;
}
h6{
  color:red;
} */
.bg-light-gray{
  background: #fbfbfb;
}
.bg-dark-gray{
  background: #efefef;
}
</style>