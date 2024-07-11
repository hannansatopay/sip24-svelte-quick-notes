<script>
  import { onMount } from 'svelte';
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  
  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    } else {
      addPage();
    }
  }); 
  
  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem('pages', JSON.stringify(pages));
  }
  
  function addPage() {
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }
  
  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }
  
  function delPage(index) {
    const pageTitle = pages[index];
    localStorage.removeItem(pageTitle);
    pages.splice(index, 1);
    if (pages.length == 0) {
      addPage();
    } else {
      selectPage(index == 0 ? 0 : index - 1);
    }
    localStorage.setItem('pages', JSON.stringify(pages));
  }
</script>

<main class="main-container">
  

  <aside class="sidebar">
    <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
      <ul class="space-y-2">
        {#each pages as page, index}
          <li>
            <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-light-yellow' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
            <button on:click={() => delPage(index)} class="text-red-500 ml-2 hover:text-red-800">Delete</button>
          </li>
        {/each}
        <li class="text-center"><button on:click={addPage} class="font-medium">+ Add Page</button></li>
      </ul>
    </div>
  </aside>

  <div class="content p-4 ml-60 h-auto">
    <div class="grid grid-cols-2 item-center mb-4">
      <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
      <button class="ml-auto save-button" on:click={saveNote}>Save</button>
    </div>
    <hr/>
    <textarea class="note-textarea" bind:value={note}></textarea>
  </div>
</main>

<style>
  .main-container {
    background: #FFFAF0; 
    min-height: 100vh; 
  }
  .sidebar {
    background: #FFE4E1; 
  }
  .bg-light-gray {
    background: #F0FFF0; 
  }
  .bg-light-yellow {
    background: #FFFACD; 
  }
  .save-button {
    background: #87CEFA; 
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    margin-top: 1rem;
    cursor: pointer;
    transition: background 0.3s;
  }
  .save-button:hover {
    background: #4682B4; 
  }
  .note-textarea {
    width: 100%;
    background: #FFFFE0; 
    border: 1px solid #DCDCDC; 
    border-radius: 0.5rem;
    padding: 1rem;
    color: #000000; 
    font-size: 1rem;
    line-height: 1.5;
  }
</style>