<script>
  import { onMount } from "svelte";
  import db from "./dexie"; // Import the Dexie database configuration

  let pages = []; // All pages stored in the database
  let currentPageIndex = 0; // Index of the currently selected page
  let title = ""; // Title of the current note
  let note = ""; // Content of the current note

  // Function to run when the component is mounted
  onMount(async () => {
    pages = await db.notes.toArray(); // Load all pages from the database
    if (pages.length > 0) {
      selectPage(0); // Select the first page if pages exist
    } else {
      addPage(); // Add a new page if no pages exist
    }
  });

  // Function to save the current note
  async function saveNote() {
    const storedPage = pages[currentPageIndex];
    if (storedPage.title !== title) {
      await db.notes.delete(storedPage.id);
      pages[currentPageIndex].title = title;
    }
    await db.notes.put({ id: storedPage.id, title, content: note });
    pages = await db.notes.toArray();
  }

  // Function to add a new page
  async function addPage() {
    const newPage = { title: "New Page", content: "" };
    const id = await db.notes.add(newPage);
    newPage.id = id;
    pages.push(newPage);
    selectPage(pages.length - 1); // Select the newly added page
  }

  // Function to select a page by index
  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].content;
  }

  // Function to delete the current page
  async function deletePage() {
    const pageToDelete = pages[currentPageIndex];
    await db.notes.delete(pageToDelete.id);
    pages = pages.filter((page) => page.id !== pageToDelete.id);
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
    }
  }

  // Function to clear the note content
  function clearNote() {
    note = "";
  }
</script>

<nav
  class="fixed top-0 left-0 z-40 w-full bg-yellow-400 text-black font-bold p-4 text-center text-3xl"
>
  QuickNotes
</nav>

<aside class="fixed top-16 left-0 z-40 w-60 h-screen bg-yellow-200 text-black">
  <div class="overflow-y-auto py-5 px-3 h-full border-r border-yellow-300">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button
            on:click={() => selectPage(index)}
            class="{index == currentPageIndex
              ? 'bg-yellow-300'
              : ''} py-2 px-3 rounded-lg">{page.title}</button
          >
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium text-gray-700"
          >+ Add page</button
        >
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 mt-16 h-auto bg-yellow-100 text-black flex flex-col">
  <div class="flex items-center justify-between mb-3">
    <h1
      class="text-3xl font-bold"
      contenteditable
      bind:textContent={title}
    ></h1>
  </div>
  <hr class="border-yellow-300" />
  <div class="flex-grow mt-3">
    <textarea
      class="block w-full h-96 bg-white border border-yellow-300 rounded-lg text-black p-2.5 resize"
      bind:value={note}
    ></textarea>
  </div>
  <div class="flex space-x-2 mt-3">
    <button
      class="bg-white text-black px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-green-400"
      on:click={saveNote}>Save</button
    >
    <button
      class="bg-white text-black px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-500"
      on:click={clearNote}>Clear</button
    >
    <button
      class="bg-gray-400 text-gray-800 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-600"
      on:click={deletePage}>Delete</button
    >
  </div>
</main>

<style>
  ::selection {
    background-color: #fde68a;
    color: black;
  }

  button:focus {
    outline: none;
  }
</style>
