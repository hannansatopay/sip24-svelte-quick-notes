<script>
  import { onMount } from 'svelte';

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      selectPage(currentPageIndex); // Ensure initial selection
    } else {
      addPage(); // Initialize with a new page if no pages are saved
    }
  });

  function saveNote() {
    pages[currentPageIndex]=title;
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }
  
  function addPage() {
    pages.push("New Page");
    selectPage(pages.length - 1); // Select the newly added page
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || ""; // Handle case where note is null
  }
</script>

<style>
  /* Global Styles */
  :global(body) {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f2f2f2;
  }

  /* Sidebar Styles */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 240px;
    height: 100vh;
    background-color: #333;
    color: #fff;
    overflow-y: auto;
    padding-top: 20px;
  }

  .sidebar ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .sidebar li {
    margin-bottom: 8px;
  }

  .sidebar button {
    width: 100%;
    padding: 10px;
    background-color: #555;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .sidebar button:hover {
    background-color: #777;
  }

  .sidebar .add-button {
    margin-top: 20px;
  }

  /* Main Content Styles */
  .main-content {
    margin-left: 240px; /* Same as sidebar width */
    padding: 20px;
  }

  .main-content h1 {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .main-content hr {
    border: none;
    border-top: 1px solid #ddd;
    margin: 20px 0;
  }

  .main-content input[type='text'],
  .main-content textarea {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    color: #333;
    margin-bottom: 10px;
  }

  .main-content button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .main-content button:hover {
    background-color: #0056b3;
  }

</style>

<div class="sidebar">
  <ul>
    {#each pages as page, index }
      <li>
        <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'active' : ''}">{page}</button>
      </li>
    {/each}
    <li class="add-button">
      <button on:click={addPage}>+ Add Page</button>
    </li>
  </ul>
</div>

<div class="main-content">
  <h1 contenteditable bind:textContent={title}>{title || "New Page"}</h1>
  <hr />
  <input type='text' bind:value={title} placeholder="Enter title">
  <textarea bind:value={note} placeholder="Add notes"></textarea>
  <button on:click={saveNote}>Save</button>
</div>
