<script>
  import { onMount } from "svelte";
  
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  
  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      if (pages.length > 0) {
        title = pages[currentPageIndex]; // Load the title of the first page
        note = localStorage.getItem(title); // Load the note of the first page
      } else {
        addPage(); // If no pages, add a new page
      }
    } else {
      addPage(); // If no saved pages, add a new page
    }
  });
  
  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      localStorage.removeItem(storedPageName); // Remove old title from localStorage
      pages[currentPageIndex] = title; // Update title in pages array
    }
    localStorage.setItem(title, note); // Save note with new title
    localStorage.setItem("pages", JSON.stringify(pages)); // Save updated pages array
  }
  
  function addPage() {
    pages.push("New Page");
    selectPage(pages.length - 1); // Select the newly added page
  }
  
  function deletePage() {
    if (pages.length === 0) return; // Prevent deletion if there are no pages
  
    const deleteSelect = pages[currentPageIndex];
    if (confirm("Are You Sure?")) { // Ask for confirmation before deleting
      localStorage.removeItem(deleteSelect); // Remove the note from localStorage
      pages.splice(currentPageIndex, 1); // Remove the page from the array
      localStorage.setItem("pages", JSON.stringify(pages)); // Save updated pages array
      
      if (pages.length > 0) { // If there are still pages left
        currentPageIndex = currentPageIndex > 0 ? currentPageIndex - 1 : 0; // Update the current page index
        title = pages[currentPageIndex]; // Update the title
        note = localStorage.getItem(title); // Load the note of the current page
      } else {
        addPage(); // If all pages are deleted, add a new page
      }
    }
  }
  
  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex]; // Update the title with the selected page
    note = localStorage.getItem(title); // Load the note of the selected page
  }
  </script>
  
  <aside class="fixed top-0 left-0 z-40 w-60 h-screen">
    <div class="bg-light-blue overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
      <ul class="space-y-2">
        {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-blue' : 'bg-white'} px-2 py-2 font-medium text-gray-900 rounded-lg">{page}</button>
        </li>
        {/each}
        <li class="text-center"><button on:click={addPage} class="bg-white px-1 py-1 rounded-md text-center font-medium">+ Add Page</button></li>
      </ul>
    </div>
  </aside>
  
  <main class="p-6 ml-60 h-auto bg-light-gray">
    <div class="grid grid-cols-2 items-center mb-4">
      <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
      <div class="flex justify-end space-x-2">
        <button class="bg-red-600 w-20 text-white py-2 font-medium text-sm rounded-md hover:bg-red-700" on:click={deletePage}>Delete</button>
        <button class="bg-black text-white py-2 px-5 font-medium text-sm rounded-md hover:bg-gray-900" on:click={saveNote}>Done</button>
      </div>
    </div>
    <hr/>
    <textarea class="mt-4 block h-60 w-full bg-light-yellow border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
  </main>
  
  <style>
  .bg-light-blue {
    background-color: #e0f7fa;
  }
  
  .bg-dark-blue {
    background-color: #0288d1;
  }
  
  .bg-light-gray {
    background-color: #f7f7f7;
  }
  
  .bg-light-yellow {
    background-color: #fff9c4;
  }
  
  button {
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    cursor: pointer;
  }
  
  aside ul li button {
    width: 100%;
    text-align: left;
  }
  
  textarea {
    resize: none;
  }
  </style>
  