<script lang="ts">
  import { onMount } from "svelte";
  import { openDB } from "idb";
  //@ts-ignore
  import deleteIcon from "./assets/delete.png";

  let db;
  let pages: string[] = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  const initDB = async () => {
    db = await openDB("notes-db", 1, {
      upgrade(db) {
        db.createObjectStore("pages", { keyPath: "id", autoIncrement: true });
        db.createObjectStore("notes");
      },
    });
  };

  onMount(async () => {
    await initDB();
    const savedPages = await db.getAll("pages");
    if (savedPages.length > 0) {
      pages = savedPages.map((page) => page.title);
      title = pages[currentPageIndex];
      note = (await db.get("notes", title)) || "";
    } else {
      addPage();
    }
  });

  const saveNote = async () => {
    const storedTitle = pages[currentPageIndex];
    if (title !== storedTitle) {
      await db.delete("notes", storedTitle);
      pages[currentPageIndex] = title;
      await db.put("pages", { id: currentPageIndex + 1, title });
    }
    await db.put("notes", note, title);
  };

  const addPage = async () => {
    pages = [...pages, "New Page"]; // Ensure reactivity
    await db.put("pages", { id: pages.length, title: "New Page" });
    selectPage(pages.length - 1);
  };

  const selectPage = async (index: number) => {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = (await db.get("notes", title)) || "";
  };

  const deletePage = async (index: number) => {
    const currentPage = pages[index];
    pages = pages.slice(0, index).concat(pages.slice(index + 1)); // Ensure reactivity
    await db.delete("pages", index + 1);
    await db.delete("notes", currentPage);

    if (pages.length > 0) {
      // Adjust currentPageIndex if necessary
      if (currentPageIndex >= index) {
        currentPageIndex = Math.max(currentPageIndex - 1, 0);
      }
      selectPage(currentPageIndex);
    } else {
      // Clear database and reset state
      await db.clear("pages");
      await db.clear("notes");
      addPage(); // Add a new page if no pages are left
    }
  };
</script>

<aside class="fixed top-0 left-0 h-screen w-60 z-40">
  <div class="h-full border-r-2 overflow-y-auto py-4 px-3">
    <ul class="space-y-2">
      {#if pages.length !== 0}
        {#each pages as page, index}
          <li class="w-full flex justify-between items-center">
            <button
              on:click={() => selectPage(index)}
              class="{index === currentPageIndex
                ? 'bg-dark-gray'
                : ''} py-2 px-3 text-gray-900 inline w-full rounded-l-lg"
              >{page}</button
            >
            <button
              on:click={() => deletePage(index)}
              class="{index === currentPageIndex
                ? 'bg-dark-gray'
                : ''} py-3 px-3 rounded-r-lg flex items-center justify-center h-full"
            >
              <img
                src={deleteIcon}
                alt="delete button"
                class="h-4 inline mx-2"
              />
            </button>
          </li>
        {/each}
      {/if}
      <li class="text-center">
        <button
          class="font-semibold bg-slate-400 py-2 px-3 rounded-lg w-full hover:bg-slate-500 transition-colors duration-100 ease-in-out"
          on:click={addPage}>+ Add Page</button
        >
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60">
  <div class="grid grid-cols-12">
    <h1
      class="text-3xl font-bold col-span-10 outline-none"
      contenteditable
      bind:textContent={title}
    ></h1>
    <button
      class="col-start-11 col-span-2 uppercase bg-slate-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors duration-100 ease-in-out"
      on:click={saveNote}
    >
      Save
    </button>
  </div>
  <textarea
    bind:value={note}
    placeholder="Add Note"
    class="text-lg block w-full bg-slate-50 border border-gray-300 rounded-lg text-gray-700 p-2.5 mt-4"
  ></textarea>
</main>

<style>
  .bg-dark-gray {
    background-color: #cfcfcf;
  }
</style>
