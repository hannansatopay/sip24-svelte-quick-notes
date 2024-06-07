<!-- <script>
  import { onMount } from 'svelte';

  let pages=[];
  let currentPageIndex=0;
 let title ='';
 let note ='';

 onMount(()=>{
  const savedPages=localStorage.getItem('pages');
  if (savedPages) {
    pages = JSON.parse(savedPages);
    title = pages[currentPageIndex] || "New Page";
    note=localStorage.getItem(title);
  } else {
    addPage();
  }
 });
 function saveNote() {
  const storedPageName = pages[currentPageIndex];
  if (storedPageName != title) {
    localStorage.removeItem(storedPageName);
    pages[currentPageIndex]=title;
  }
  pages[currentPageIndex] = title;
  localStorage.setItem(title,note);
  localStorage.setItem('pages',JSON.stringify(pages));
 }

 function addPage() {
  pages.push("New Page");
  selectPage[pages.length ? pages.length-1 : 0]
 }

 function selectPage(index) {
  currentPageIndex = index;
  title = pages[currentPageIndex];
  note = localStorage.getItem(title);
 }

//  function deletePage(index){
//   const storedPageName = pages[index];
//   localStorage.removeItem(storedPageName);
//   pages.splice(index, 1);
//   localStorage.setItem('pages',JSON.stringify(pages));
//   if(pages.length > 0 ) {
//     currentPageIndex = Math.min(currentPageIndex, pages.length-1);
//     title=pages[currentPageIndex];
//     note=localStorage.getItem(title);
//   }
  // pages=pages;
//  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-gray-500 overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={()=>selectPage(index)} class="{index==currentPageIndex ? 'bg-[#e8e8e8]':''} flex justify-between w-full py-2 px-3 text-gray-900 rounded-lg">
          <div>{page}</div>
          <button class="bg-black text-white rounded-lg py-0.5 px-3">Delete</button>
        </button>
      </li>
      {/each}
      <li class="text-center">
        <button class="bg-[#FFFFFF]  w-full py-2 px-3 text-gray-900 rounded-lg font-medium" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote} >Save</button>
  </div>
  <textarea class="block w-full mt-3 bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  
</main>

<style>

</style> -->


<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  let db;

  onMount(async () => {
    db = await openDB('notes-db', 1, {
      upgrade(db) {
        db.createObjectStore('notes', { keyPath: 'title' });
        db.createObjectStore('pages', { keyPath: 'name' });
      },
    });

    const savedPages = await db.getAll('pages');
    if (savedPages.length > 0) {
      pages = savedPages.map(page => page.name);
      title = pages[currentPageIndex];
      const savedNote = await db.get('notes', title);
      note = savedNote ? savedNote.content : '';
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.delete('notes', storedPageName);
      await db.put('pages', { name: title });
    }
    await db.put('notes', { title, content: note });
    await db.put('pages', { name: title });
    pages[currentPageIndex] = title;
  }

  async function addPage() {
    const newPage = 'New Page';
    pages.push(newPage);
    currentPageIndex = pages.length - 1;
    title = newPage;
    note = '';
    await db.put('pages', { name: newPage });
    await saveNote();
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const savedNote = await db.get('notes', title);
    note = savedNote ? savedNote.content : '';
  }

  async function deletePage(index) {
    const storedPageName = pages[index];
    await db.delete('notes', storedPageName);
    await db.delete('pages', storedPageName);
    pages.splice(index, 1);
    if (pages.length > 0) {
      currentPageIndex = Math.min(currentPageIndex, pages.length - 1);
      title = pages[currentPageIndex];
      const savedNote = await db.get('notes', title);
      note = savedNote ? savedNote.content : '';
    } else {
      addPage();
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-gray-500 overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-[#e8e8e8]' : ''} flex justify-between w-full py-2 px-3 text-gray-900 rounded-lg">
            <div>{page}</div>
            <button on:click={() => deletePage(index)} class="bg-black text-white rounded-lg py-0.5 px-3">Delete</button>
          </button>
        </li>
      {/each}
      <li class="text-center">
        <button class="bg-[#FFFFFF] w-full py-2 px-3 text-gray-900 rounded-lg font-medium" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <textarea class="block w-full mt-3 bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  /* Add any custom styles here */
</style>
