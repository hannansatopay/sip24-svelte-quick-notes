<script>
  import { onMount } from "svelte";
  import axios from "axios";

  let pages = [];
  let currentpageIndex = 0;
  let title = "";
  let note = "";

  onMount(fetchPages);

  async function fetchPages() {
    try {
      const response = await axios.get("http://localhost:5000/notes");
      pages = response.data;
      if (pages.length > 0) {
        selectPage(0);
      } else {
        addPage(); // Automatically add a page if none exist
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    }
  }

  async function saveNote() {
    try {
      const storedPage = pages[currentpageIndex];
      const updatedPage = await axios.put(
        `http://localhost:5000/notes/${storedPage._id}`,
        { title, note }
      );
      pages[currentpageIndex] = updatedPage.data;
    } catch (error) {
      console.error("Error saving note:", error);
    }
  }

  async function addPage() {
    try {
      const response = await axios.post("http://localhost:5000/notes", {
        title: "New Page",
        note: "",
      });
      const newPage = response.data;
      pages.push(newPage);
      selectPage(pages.length - 1);
    } catch (error) {
      console.error("Error adding page:", error);
    }
  }

  async function selectPage(index) {
    currentpageIndex = index;
    title = pages[currentpageIndex].title;
    note = pages[currentpageIndex].note;
  }

  async function deletePage(index) {
    try {
      const pageToDelete = pages[index];
      if (confirm(`Are you sure you want to delete "${pageToDelete.title}"?`)) {
        await axios.delete(`http://localhost:5000/notes/${pageToDelete._id}`);
        pages.splice(index, 1);
        if (currentpageIndex >= pages.length) {
          currentpageIndex = pages.length - 1;
        }
        if (pages.length > 0) {
          selectPage(currentpageIndex);
        } else {
          title = "";
          note = "";
        }
      }
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div
    class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200"
  >
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button
            on:click={() => selectPage(index)}
            class="{index == currentpageIndex
              ? 'bg-dark-gray'
              : ''} py-2 px-3 text-gray-900 rounded-lg"
          >
            {page.title}
          </button>
          <button
            on:click={() => deletePage(index)}
            class="ml-2 text-red-500"
            title="Delete">X</button
          >
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1
      class="text-3xl font-bold"
      contenteditable
      bind:textContent={title}
    ></h1>
    <button
      class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900"
      on:click={saveNote}>Save</button
    >
  </div>
  <hr />
  <input
    class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={title}
    type="text"
    placeholder="Add Title"
  />
  <textarea
    class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={note}
  ></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }

  .bg-dark-gray {
    background: #e3dede;
  }
</style>
