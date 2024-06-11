<script>
  import { onMount } from "svelte";
  import {
    getAllPages,
    saveNote,
    deleteNoteAndPage,
    addPage,
    updatePageTitle,
  } from "./db";

  let title = "";
  let note = "";
  let pages = [];
  let currentPageIndex = 0;

  onMount(async () => {
    try {
      pages = await getAllPages();
      if (pages.length === 0) {
        await addPage("New Page");
        pages = await getAllPages();
      }
      selectPage(currentPageIndex);
    } catch (error) {
      console.error("Error initializing pages:", error);
    }
  });

  async function save() {
    try {
      await saveNote(pages[currentPageIndex].id, note);
      pages = await getAllPages();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  }

  async function remove() {
    try {
      await deleteNoteAndPage(pages[currentPageIndex].id);
      pages = await getAllPages();
      if (pages.length === 0) {
        await addPage("New Page");
        pages = await getAllPages();
      }
      currentPageIndex = pages.length - 1 < 0 ? 0 : pages.length - 1;
      selectPage(currentPageIndex);
    } catch (error) {
      console.error("Error deleting note and page:", error);
    }
  }

  async function add() {
    try {
      await addPage("New Page");
      pages = await getAllPages();
      currentPageIndex = pages.length - 1;
      selectPage(currentPageIndex);
    } catch (error) {
      console.error("Error adding page:", error);
    }
  }

  async function updateTitle(event) {
    try {
      let newTitle = event.target.textContent;
      await updatePageTitle(pages[currentPageIndex].id, newTitle);
      pages[currentPageIndex].title = newTitle;
    } catch (error) {
      console.error("Error updating title:", error);
    }
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title || "New Page";
    note = pages[currentPageIndex].note || "";
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div
    class="bg-blue-100 overflow-y-auto py-5 px-3 h-full border-r border-gray-200"
  >
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button
            on:click={() => selectPage(index)}
            class="{index === currentPageIndex
              ? 'bg-blue-700 text-white'
              : 'text-gray-900'} py-2 px-3 rounded-lg"
          >
            {page.title}
          </button>
        </li>
      {/each}
      <li class="text-center">
        <button class="font-medium" on:click={() => add()}>+Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="flex justify-between items-center mb-3">
    <h1
      class="text-3xl font-bold"
      contenteditable
      on:blur={updateTitle}
      style="color: #333;"
    >
      {title}
    </h1>
    <div>
      <button
        class="bg-blue-700 text-white ml-auto px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-blue-800"
        on:click={remove}>Delete</button
      >
      <button
        class="bg-blue-700 text-white ml-auto px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-blue-800"
        on:click={save}>Save</button
      >
    </div>
  </div>
  <textarea
    class="mt-3 block w-full bg-blue-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={note}
  ></textarea>
</main>
