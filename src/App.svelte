<script>
  import { onMount } from 'svelte';

  let note = "";
  let pages = [];
  let currentPageIndex = 0;
  let title = "";

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      selectPage(0);
    } else {
      addPage();
    }
  });

  function saveNames() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function buttonClick() {
    alert(`Hello ${note}, your title is ${title}`);
    saveNames();
  }

  function addPage() {
    if (!pages.includes(`New Page ${pages.length + 1}`)) {
      pages.push(`New Page ${pages.length + 1}`);
      selectPage(pages.length - 1);
    }
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || "";
  }
</script>

<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .container {
    width: 80%;
    max-width: 800px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }

  .title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .title-bar h1 {
    margin: 0;
  }

  .sidebar {
    max-width: 200px;
    margin-right: 20px;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
  }

  .sidebar li {
    margin-bottom: 10px;
  }

  .sidebar button {
    width: 100%;
    padding: 10px;
    text-align: left;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .sidebar button:hover {
    background-color: #007BFF;
    color: white;
  }

  .sidebar button.active {
    background-color: #0056b3;
    color: white;
  }

  .main-content {
    flex-grow: 1;
  }

  .main-content textarea,
  .main-content input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .main-content button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .main-content button:hover {
    background-color: #0056b3;
  }
</style>

<div class="container">
  <div class="title-bar">
    <h1>Note Taking App</h1>
  </div>
  <div style="display: flex;">
    <aside class="sidebar">
      <ul>
        {#each pages as page, index}
          <li>
            <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'active' : ''}">{page}</button>
          </li>
        {/each}
        <li class="text-center">
          <button on:click={addPage}>+ Add Page</button>
        </li>
      </ul>
    </aside>
    <main class="main-content">
      <div class="grid grid-cols-2 items-center mb-3">
        <input type="text" class="text-3xl font-bold" bind:value={title} on:input={saveNames} placeholder="Page Title">
        <button class="ml-auto bg-green-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={buttonClick}>Save</button>
      </div>
      <textarea class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5 mb-4" bind:value={note} placeholder="Add your note"></textarea>
    </main>
  </div>
</div>

