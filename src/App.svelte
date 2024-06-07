<script>
  import { onMount } from 'svelte';
  import { openDB } from 'idb';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  async function getDB() {
    return openDB('notes-db', 1, {
      upgrade(db) {
        db.createObjectStore('notes');
        db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
      }
    });
  }

  onMount(async () => {
    const db = await getDB();
    const savedPages = await db.getAll('pages');
    if (savedPages.length) {
      pages = savedPages.map(page => page.title);
      title = pages[currentPageIndex];
      note = await db.get('notes', title) || '';
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const db = await getDB();
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.delete('notes', storedPageName);
      pages[currentPageIndex] = title;
    }
    await db.put('notes', note, title);
    await db.put('pages', { id: currentPageIndex, title: title });
  }

  async function addPage() {
    const db = await getDB();
    const newTitle = 'Untitled';
    pages.push(newTitle);
    await db.put('pages', { id: pages.length - 1, title: newTitle });
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    const db = await getDB();
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = await db.get('notes', title) || '';
  }

  async function deletePage() {
    if (pages.length > 1) {
      const db = await getDB();
      const pageTitle = pages[currentPageIndex];
      await db.delete('notes', pageTitle);
      pages.splice(currentPageIndex, 1);
      if (currentPageIndex >= pages.length) {
        currentPageIndex = pages.length - 1;
      }
      title = pages[currentPageIndex];
      note = await db.get('notes', title) || '';
      await db.clear('pages');
      pages.forEach((pageTitle, index) => db.put('pages', { id: index, title: pageTitle }));
    } else {
      alert("You cannot delete the last page.");
    }
  }

  function blur() {
    document.getElementById("myText").blur();
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-lightgray':'bg-dark-gray'} py-2 px-3 w-full text-gray-900 rounded-lg">{page}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="flex justify-between items-center mb-3">
    <div
      class="title text-2xl"
      contenteditable
      bind:innerHTML={title}
      class:title-placeholder={title === ''}
    >
      {#if title === ''}
        Untitled
      {/if}
    </div>
    <div class="flex space-x-2">
      <button class="save text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900" on:click={saveNote}>Save</button>
      <button class="delete text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900" on:click={deletePage}>Delete</button>
    </div>
  </div>
  <hr/>
  <div class="notebook mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
    <textarea id="myText" bind:value={note} style="height: 470px;"></textarea>
  </div>
</main>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }
  .bg-dark-gray {
    background: hsl(188, 66%, 87%);
  }
  .title{
    outline: none;
  }
  .title-placeholder::before {
    content: 'Untitled';
    color: #aaa;
    pointer-events: none;
  }
  .bg-lightgray{
    background: rgb(158, 223, 234);
    color: black;
  }
  .save{
    background: rgb(98, 154, 13);
    color: white;
    font-size: 15px;
  }
  .save:hover{
    background: rgb(117, 177, 27);
    
  }
  .delete{
    background: rgb(99, 93, 93);
    color: white;
    font-size: 15px;
  }
  .delete:hover{
    background: rgb(116, 114, 114);
  }
  textarea {
    border: none;
    overflow: auto;
    outline: none;

    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;

    resize: none; 
}
  .notebook {
    width: 100%;
    height: 470px;
    background: repeating-linear-gradient(
      white,
      white 29px,
      #b6b7b7 30px
    );
    padding: 4px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    border: 1px solid #ccc;
    border-radius: 5px;
    position: relative;
    outline: none !important;
    
  }
  
  .notebook textarea {
    width: 100%;
    height: 100%;
    border: none;
    resize: none;
    overflow-y: auto;
    background: transparent;
    line-height: 30px;
    font-size: 18px;
    padding: 0;
    margin: 0;
    outline: none !important; 
    color: #333;
    font-family: 'Courier New', Courier, monospace;
  }
  .notebook textarea:focus {
    outline: none !important; 
  }
</style>
