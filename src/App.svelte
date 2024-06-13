<script>
  import { onMount } from "svelte";
  import Dexie from "dexie";

  // Initialize IndexedDB using Dexie.js
  const db = new Dexie("notesDB");
  db.version(1).stores({
    pages: "++id,title,note",
  });

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  onMount(() => {
    loadPages();
  });

  async function loadPages() {
    try {
      const pagesFromDB = await db.pages.toArray();
      pages = pagesFromDB;

      if (pages.length > 0) {
        currentPageIndex = 0;
        selectPage(currentPageIndex);
      } else {
        await addPage();
      }
    } catch (error) {
      console.error("Error loading pages from IndexedDB:", error);
    }
  }

  async function saveNote() {
    try {
      const updatedPage = {
        id: pages[currentPageIndex].id,
        title: title,
        note: note,
      };

      await db.pages.put(updatedPage);
      pages[currentPageIndex] = updatedPage;

      console.log("Note saved successfully.");
    } catch (error) {
      console.error("Error saving note to IndexedDB:", error);
    }
  }

  async function addPage() {
    try {
      const newPage = {
        title: "New Page",
        note: "",
      };

      const newPageId = await db.pages.add(newPage);
      pages.push({ id: newPageId, ...newPage });
      currentPageIndex = pages.length - 1;
      selectPage(currentPageIndex);

      console.log("New page added successfully.");
    } catch (error) {
      console.error("Error adding new page to IndexedDB:", error);
    }
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].note;
  }

  async function deleteCurrentPage() {
    try {
      const pageToDelete = pages[currentPageIndex];

      await db.pages.delete(pageToDelete.id);
      pages.splice(currentPageIndex, 1);

      if (currentPageIndex >= pages.length) {
        currentPageIndex = pages.length - 1;
      }

      if (pages.length > 0) {
        selectPage(currentPageIndex);
      } else {
        await addPage();
      }

      console.log("Page deleted successfully.");
    } catch (error) {
      console.error("Error deleting page from IndexedDB:", error);
    }
  }
</script>


<header class="fixed top-0 left-9 w-full bg-light-gray text-black py-2 px-4 text-center">
  <h1 class="text-xl font-bold">
    Summer Internship Svelte Fundamentals - Quciky_Notes App by Anuranjan Singh
  </h1>
</header>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full  border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex items-center">
          <button
            on:click={() => selectPage(index)}
            class="bg-dark-gray py-2 px-3 text-gray-900 rounded-lg flex-grow mt-2"
          >
            {page.title}
          </button>
        </li>
      {/each}
      <li class="flex justify-between">
        <button on:click={addPage} class="font-medium bg-green-500 text-white px-3 py-1 rounded-lg p-2.5">Add Page</button>
        <button on:click={deleteCurrentPage} class="font-medium bg-red-500 text-white px-3 py-1 rounded-lg p-2.5">Delete Page</button>
      </li>

      <button
        class="block w-full font-medium bg-blue-800 text-white px-3 py-1 rounded-lg p-2.5"
        on:click={saveNote}
      >
        Save
      </button>

      <li class="font-medium text-black px-3 py-1 p-2.5">Choose option-->Hit Save</li>

    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto mt-10">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1
      class="text-3xl font-bold"
      contenteditable
      bind:textContent={title}
    ></h1>
  </div>
  <hr />
  <input
    class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5 mt-3"
    bind:value={title}
    type="text"
    placeholder="Enter page title here"
  />
  <textarea
    class="mt-3 block w-full bg-gray-50 border border-gray-300 text-gray-900 p-2.5 rounded-lg"
    bind:value={note}
    placeholder="Enter your note here"
  ></textarea>
</main>

<footer class=" fixed bottom-0 left-8 w-full  text-center py-1 bg-light-gray text-black py-2 px-4 text-center ">
  <p class="text-meduim text-black-600 font-bold ">
    App features - 1) Delete Page Function 2) IndexedDB using dexieJs
  </p>
</footer>

<style>
  .bg-light-gray {
    background: #f0f4f8;
  }

  .bg-dark-gray {
    background: #d3dae0;
  }

  aside button {
    transition: background-color 0.3s;
  }

  aside button:hover {
    background-color: #c0c7cf;
  }

  main input,
  main textarea {
    transition: border-color 0.3s;
  }

  main input:focus,
  main textarea:focus {
    border-color: #a3b1c6;
    outline: none;
  }

  button:focus {
    outline: none;
  }
</style>
