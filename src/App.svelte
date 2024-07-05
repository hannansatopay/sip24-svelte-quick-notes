<script>
  import { onMount } from 'svelte';
  
  let pages = [];
  let currentPageIndex = 0;
  let currentTitle = "";
  let currentNote = "";
  
  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      selectPage(0);
    } else {
      addPage();
    }
  });
  
  function handleSaveClick() {
    const storedPagename = pages[currentPageIndex];
    if(storedPagename != currentTitle){
      localStorage.removeItem(storedPagename);
      pages[currentPageIndex] = currentTitle;
    }
    
    localStorage.setItem(currentTitle, currentNote);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    const newPageTitle = "New Page " + (pages.length + 1);
    pages = [...pages, newPageTitle];
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPageIndex = index;
    currentTitle = pages[currentPageIndex];
    currentNote = localStorage.getItem(currentTitle) || "";
  }

  function deletePage(index) {
    const pageTitle = pages[index];
    localStorage.removeItem(pageTitle);
    pages = pages.filter((_, i) => i !== index);
    localStorage.setItem("pages", JSON.stringify(pages));

    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(Math.min(index, pages.length - 1));
    }
  }
</script>

<div class="app-container">
  <aside class="sidebar">
    <div class="sidebar-content">
      <ul class="sidebar-list">
        {#each pages as page, index}
          <li class="sidebar-item">
            <button 
              on:click={() => selectPage(index)} 
              class="sidebar-button {index === currentPageIndex ? 'bg-dark-grey' : ''}"
            >
              {page}
            </button>
            <button 
              on:click={() => deletePage(index)} 
              class="delete-button"
              title="Delete page"
            >
              ×
            </button>
          </li>
        {/each}
        <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
      </ul>
    </div>
  </aside>

  <main class="main-content">
    <div class="header">
      <input 
        type="text" 
        bind:value={currentTitle} 
        class="title-input"
        placeholder="Page Title"
      />
      <button class="save-button" on:click={handleSaveClick}>Save Note</button>
    </div>
    <textarea
      class="textarea"
      placeholder="Write your note here..."
      bind:value={currentNote}
    ></textarea>
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
  }

  .app-container {
    display: flex;
    height: 100vh;
  }

  .sidebar {
    width: 250px;
    background: #ffffff;
    border-right: 1px solid #e0e0e0;
    overflow-y: auto;
  }

  .sidebar-content {
    padding: 20px;
  }

  .sidebar-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .sidebar-button {
    background: #f5f5f5;
    padding: 10px 15px;
    border-radius: 8px;
    width: 100%;
    text-align: left;
    border: 1px solid #e0e0e0;
    cursor: pointer;
    transition: background-color 0.2s ease;
    flex-grow: 1;
    margin-bottom: 0;
  }

  .sidebar-button:hover {
    background-color: #e0e0e0;
  }

  .bg-dark-grey {
    background-color: #4a5568;
    color: white;
  }

  .delete-button {
    background-color: #e53e3e;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    margin-left: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
  }

  .delete-button:hover {
    background-color: #c53030;
  }

  .main-content {
    flex-grow: 1;
    padding: 30px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .title-input {
    font-size: 24px;
    font-weight: bold;
    border: none;
    background: transparent;
    outline: none;
    width: 70%;
  }

  .save-button {
    background-color: #4a5568;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .save-button:hover {
    background-color: #2d3748;
  }

  .textarea {
    width: 100%;
    height: calc(100vh - 150px);
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    font-size: 16px;
    resize: none;
    flex-grow: 1;
  }

  .text-center {
    text-align: center;
  }

  .font-medium {
    font-weight: 500;
  }
</style>