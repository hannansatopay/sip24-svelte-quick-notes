<script>
 import { onMount } from 'svelte'

 let pages = [];
 let currentpage = 0;
let title = '';
let note = '';

onMount(() => {
  const savedpages = localStorage.getItem("pages");
  if (savedpages) {
     pages = JSON.parse(savedpages);
     title = pages[currentpage];
     note = localStorage.getItem(title);
  } else {
     addpage();
  }
});

function savenote() {
  const storedpagename = pages[currentpage];
  if (storedpagename != title) {
    localStorage.removeItem(storedpagename);
    pages[currentpage] = title;
  }
  localStorage.setItem(title, note);
  localStorage.setItem("pages", JSON.stringify(pages));
}

function addpage() {
  pages.push("new page");
  selectPage(pages.length ? pages.length - 1 : 0);
}

function selectPage(index) {
  currentpage = index;
  title = pages[currentpage];
  note = localStorage.getItem(title);
}
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={()=>selectPage(index)} class ="{index == currentpage ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button> 
      </li>
      {/each}
      <li class="text-center"><button on:click={addpage} class ="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
   <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
   <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-small mt-3 hover:bg-gray-900"on:click={savenote}>save</button>
  </div>
  <hr/>
 <textarea class="mt-3 block w-full border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note} ></textarea>
 </main>

<style>
.bg-light-gray {
  background: #FBFBFB;
}

.bg-dark-gray {
  background: #EFEFEF;
}
</style>