<script>
  import { onMount } from 'svelte';

  let Page = [];
  let currentpageIndex = 0;
  let title = 'New Note';
  let note = 'Today is an excellent day';
  let searchQuery = '';
  let filteredPages = [];

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      Page = JSON.parse(savedPages);
      filteredPages = Page;
      title = Page[currentpageIndex];
      note = localStorage.getItem(title);
    } else {
      addPage();
    }
  });

  function saveNote() {
    const storedPageName = Page[currentpageIndex];
    if (storedPageName !== title) {
      localStorage.removeItem(storedPageName);
      Page[currentpageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(Page));
    filterPages();
  }

  function addPage() {
    Page.push("New Page");
    selectPage(Page.length ? Page.length - 1 : 0);
    filterPages();
  }

  function selectPage(index) {
    currentpageIndex = Page.indexOf(filteredPages[index]);
    title = filteredPages[index];
    note = localStorage.getItem(title);
  }

  function deletePage(index) {
    const pageToDelete = filteredPages[index];
    const realIndex = Page.indexOf(pageToDelete);
    localStorage.removeItem(pageToDelete);
    Page.splice(realIndex, 1);
    filteredPages.splice(index, 1);
    if (index === currentpageIndex) {
      currentpageIndex = filteredPages.length ? 0 : -1;
    }
    if (filteredPages.length) {
      title = filteredPages[currentpageIndex];
      note = localStorage.getItem(title);
    } else {
      title = 'New Note';
      note = 'Today is an excellent day';
    }
    localStorage.setItem("pages", JSON.stringify(Page));
  }

  function deleteAllPages() {
    Page.forEach(page => localStorage.removeItem(page));
    Page = [];
    filteredPages = [];
    title = 'New Note';
    note = 'Today is an excellent day';
    currentpageIndex = -1;
    localStorage.removeItem("pages");
  }

  function filterPages() {
    filteredPages = Page.filter(page => page.toLowerCase().includes(searchQuery.toLowerCase()));
  }
</script>

<style>
  :global(body) {
    margin: 0;
    font-family: Arial, sans-serif;
  }

  .navbar {
    background-color: #2d3748;
    color: white;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center; /* Center align horizontally */
    font-weight: bold; /* Make the text bold */
    position: relative; /* Position for absolute children */
  }

  .navbar input {
    margin-left: auto;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid #cbd5e0;
    color: black; /* Change the text color to black */
  }

  .sidebar {
    background-color: #2b6cb0;
    color: white;
    width: 200px;
    height: 100vh;
    padding: 1rem;
    position: fixed;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
  }

  .sidebar li {
    margin-bottom: 1rem;
  }

  .sidebar button {
    width: 100%;
    background-color: #2c5282;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 0.25rem;
    cursor: pointer;
    margin-bottom: 0.5rem; /* Added space between buttons */
  }

  .sidebar button:hover,
  .sidebar button.active {
    background-color: #2b6cb0;
  }

  .main {
    margin-left: 220px;
    padding: 2rem;
  }

  .main h1 {
    border: 1px solid #cbd5e0;
    padding: 0.5rem;
    border-radius: 0.25rem;
    width: calc(100% - 10rem);
    margin-bottom: 1rem; /* Added space below the title */
  }

  .main .button-container {
    display: flex;
    gap: 1rem; /* Added space between buttons */
    margin-bottom: 1rem; /* Added space below the buttons */
  }

  .main button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  .main button.save {
    background-color: #2b6cb0;
    color: white;
  }

  .main button.delete {
    background-color: #e53e3e;
    color: white;
  }

  .main textarea {
    width: calc(100% - 2rem);
    height: 300px;
    margin-top: 1rem;
    padding: 1rem;
    border: 1px solid #cbd5e0;
    border-radius: 0.25rem;
    resize: none;
  }

  .delete-all {
    background-color: #e53e3e;
    color: white;
    border: none;
    padding: 0.5rem;
    border-radius: 0.25rem;
    cursor: pointer;
    margin-top: 1rem;
  }

  .delete-all:hover {
    background-color: #c53030;
  }
</style>

<div class="navbar">
  <h1>Quick Notes</h1>
  <input type="text" placeholder="Search notes" bind:value={searchQuery} on:input={filterPages} />
</div>

<div class="sidebar">
  <ul>
    {#each filteredPages as page, index}
      <li>
        <button 
          on:click={() => selectPage(index)} 
          class="{index == currentpageIndex ? 'active' : ''}"
        >
          {page}
        </button>
      </li>
    {/each}
    <li><button on:click={addPage}>+ Add Note</button></li>
  </ul>
  {#if Page.length > 0}
    <button on:click={deleteAllPages} class="delete-all">Delete all Notes</button>
  {/if}
</div>

<div class="main">
  <h1 contenteditable bind:textContent={title}></h1>
  <div class="button-container">
    <button class="save" on:click={saveNote}>Save</button>
    <button class="delete" on:click={() => deletePage(currentpageIndex)}>Delete</button>
  </div>
  <textarea bind:value={note}></textarea>
</div>