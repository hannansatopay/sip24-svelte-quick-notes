<script>

import { onMount } from 'svelte'

let pages = [];
let currentPageIndex = 0;
let title = '';
let note = '';

onMount(() => {
  const savedPages = localStorage.getItem('pages');
  if(savedPages){
    pages = JSON.parse(savedPages);
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }
  else{
    addPage();
  }
});

function saveNote(){
  const storedPageName = pages[currentPageIndex];
  if(storedPageName != title){
    localStorage.removeItem(storedPageName);
    pages[currentPageIndex] = title;
  }
  localStorage.setItem(title, note);
  localStorage.setItem('pages', JSON.stringify(pages));
}

function addPage(){
  pages.push('New Page');
  selectPage(pages.length ? pages.length - 1 : 0);
}

function selectPage(index){
  currentPageIndex = index;
  title = pages[currentPageIndex];
  note = localStorage.getItem(title);
}

</script>

<aside class = 'w-80 fixed top-0 left-0 z-40 h-screen'>
  <section class = 'px-5 py-5 border-r border-black h-full overflow-y-screen'>
    <ul class = 'space-y-3'>
      {#each pages as page, index}
      <li>
        <button class = '{index == currentPageIndex ? 'bg-gray-300' : ''}  px-8 py-1.5 rounded-lg' on:click={() => selectPage(index)}>{page}</button>
      </li>
      {/each}
      <li class = 'text-center'>
        <button class = 'font-medium' on:click={addPage}>+Add Page</button>
      </li>
      <!-- <li class = 'text-center'> -->
        <!-- <button class = 'font-medium' on:click={deletePage}>-Delete Page</button> -->
      <!-- </li> -->
    </ul>
  </section>
</aside>
<main>
  <section class = 'p-4 ml-80'>
    <section class = 'grid grid-cols-2 mb-3'>
     <h1 class = 'bg-gray-100 text-charcoal rounded-lg font-bold text-2xl' contenteditable bind:textContent={title}></h1>
      <button class = 'bg-black text-white rounded-lg ml-auto px-8 py-1' on:click={saveNote}>Save</button>
    </section>
    <hr/>
    <textarea class = 'mt-3 w-full rounded-lg' bind:value={note}></textarea>
  </section>
</main>

<style>

.text-charcoal{
  color: rgb(54, 69, 79);
}

</style>