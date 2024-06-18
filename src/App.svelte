<script>
  import { onMount } from 'svelte';
  import { getAllPages, saveNote, deleteNoteAndPage, addPage, updatePageTitle } from "./db";

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  // Initialize data on component mount
  onMount(async () => {
    try {
      pages = await getAllPages();
      if (pages.length === 0) {
        await addPage('New Page');
        pages = await getAllPages();
      }
      selectPage(currentPageIndex);
    } catch (error) {
      console.error("Error initializing pages:", error);
    }
  });

  // Save current note
  async function save() {
    try {
      await saveNote(pages[currentPageIndex].id, note);
      // Update pages after saving
      pages = await getAllPages();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  }

  // Remove current page and note
  async function remove() {
    try {
      await deleteNoteAndPage(pages[currentPageIndex].id);
      pages = await getAllPages();
      // If no pages left, add a new one
      if (pages.length === 0) {
        await addPage('New Page');
        pages = await getAllPages();
      }
      currentPageIndex = Math.max(0, currentPageIndex - 1); // Ensure valid index after deletion
      selectPage(currentPageIndex);
    } catch (error) {
      console.error("Error deleting note and page:", error);
    }
  }

  // Add a new page
  async function add() {
    try {
      await addPage('New Page');
      pages = await getAllPages();
      currentPageIndex = pages.length - 1;
      selectPage(currentPageIndex);
    } catch (error) {
      console.error("Error adding page:", error);
    }
  }

  // Update page title
  async function updateTitle(event) {
    try {
      let newTitle = event.target.textContent;
      await updatePageTitle(pages[currentPageIndex].id, newTitle);
      pages[currentPageIndex].title = newTitle;
    } catch (error) {
      console.error("Error updating title:", error);
    }
  }

  // Select a page to display its details
  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title || "New Page";
    note = pages[currentPageIndex].note || "";
  }
</script>

<style>
  .bg-light-gray {
    background: #FBFBFB;
  }

  .bg-dark-gray {
    background: #EFEFEF;
  }

  .relative {
    position: relative;
  }

  .title-wrapper {
    position: relative;
    overflow: hidden;
    display: inline-block;
    max-width: calc(100% - 80px);
  }

  .title-button {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 10px;
  }

  .title-wrapper:hover .title-button {
    overflow: visible;
    white-space: normal;
  }

  .delete-btn {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
</style>

<!-- HTML Markup -->
<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="relative">
          <div class="title-wrapper">
            <button on:click={() => selectPage(index)} class="title-button {index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
          </div>
          <button class="delete-btn bg-gray-800 text-white px-5 py-2.5 rounded-md font-medium text-sm hover:bg-red-800" on:click={() => remove()}>Delete</button>
        </li>
      {/each}
      <li class="text-center">
        <button class="font-medium py-2.5" on:click={() => add()}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="flex justify-between items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable on:blur={updateTitle}>{title}</h1>
    <div>
      <button class="bg-gray-800 ml-auto text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={() => save()}>Save</button>
    </div>
  </div>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>
