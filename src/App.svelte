<script>
  import { onMount } from "svelte";
  import Dexie from "dexie";

  const db = new Dexie("noteApp");
  db.version(1).stores({
    pages: "++id, title, note",
  });

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  onMount(async () => {
    try {
      const savedPages = await db.pages.toArray();
      if (savedPages.length) {
        pages = savedPages;
        selectPage(0);
      } else {
        await addPage();
      }
    } catch (error) {
      console.error("Error loading pages:", error);
    }
  });

  async function saveNote() {
    try {
      const currentPage = pages[currentPageIndex];
      if (currentPage.title !== title) {
        await db.pages.where("title").equals(currentPage.title).delete();
        currentPage.title = title;
      }
      currentPage.note = note;
      await db.pages.put(currentPage);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  }

  async function addPage() {
    try {
      const newPage = { title: "New Page", note: "" };
      const id = await db.pages.add(newPage);
      pages.push({ ...newPage, id });
      selectPage(pages.length - 1);
    } catch (error) {
      console.error("Error adding page:", error);
    }
  }

  async function selectPage(index) {
    currentPageIndex = index;
    const currentPage = pages[currentPageIndex];
    title = currentPage.title;
    note = currentPage.note;
  }

  async function deletePage(index) {
    try {
      const pageToDelete = pages[index];
      await db.pages.delete(pageToDelete.id);
      pages.splice(index, 1);
      if (index === currentPageIndex) {
        if (index >= pages.length) {
          currentPageIndex = pages.length - 1;
        } else {
          currentPageIndex = index;
        }
        selectPage(currentPageIndex);
      } else if (index < currentPageIndex) {
        currentPageIndex--;
      }
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-40 h-screen">
  <div
    class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200"
  >
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button
            on:click={() => selectPage(index)}
            class="{index == currentPageIndex
              ? 'bg-dark-gray'
              : ''} py-2 px-3 text-gray-900 rounded-lg">{page.title}</button
          >
          <button
            on:click={() => deletePage(index)}
            class="bg-red-500 text-white px-2 py-1 rounded-lg text-sm ml-2"
          >
            Delete
          </button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+Add Page</button>
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
    background: #efefef;
  }
</style>
