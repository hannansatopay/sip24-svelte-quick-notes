<script>
  import { onMount } from 'svelte';

  let title = 'New Note';
  let note = ''; // Initialize note to an empty string
  let pages = []; // Array to store page names
  let currentPageIndex = 0; // Index of the current page

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }

    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPages() {
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || ''; // Set note to empty string if no note exists
  }

  // Load existing data from localStorage on component mount (optional)
  onMount(() => {
    const storedPages = localStorage.getItem("pages");
    if (storedPages) {
      pages = JSON.parse(storedPages);
      selectPage(currentPageIndex || 0); // Load current page or default to 0
    } else {
      addPages(); // Create a new page if no data exists
    }
  });
</script>

<main class="p-4">
  <input class="block w-full bg-gray-50 border border-gray-300 rounded-lg" bind:value={title} placeholder="Add title">
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 round-lg text-gray-900 p-2.5" placeholder="Enter your notes here" bind:value={note}></textarea>
  <button class="bg-gray-600 text white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
</main>

<style>
  h1 {
    color: blue;
  }
</style>
