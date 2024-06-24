<script>
  import { onMount } from "svelte";
  import Dexie from "dexie";
  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";
  const db = new Dexie("notesDB");
  db.version(1).stores({
    pages: "title",
    notes: "title, note",
  });
  onMount(async () => {
    const savedPages = await db.pages.toArray();
    if (savedPages.length > 0) {
      pages = savedPages.map((page) => page.title);
      title = pages[currentPageIndex];
      const noteData = await db.notes.get(title);
      note = noteData.note;
      console.log("pages loaded");
    } else {
      addPage();
      console.log("adding page");
    }
  });
  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title) {
      await db.pages.delete(storedPageName);
      await db.notes.delete(storedPageName);
      pages[currentPageIndex] = title;
    }
    await db.notes.put({ title, note: note || "" });
    await db.pages.put({ title: pages[currentPageIndex] });
  }
  function addPage() {
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }
  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const noteData = (await db.notes.get(title)) || "";
    note = noteData.note;
  }
  async function deletePage(index) {
    const pageTitle = pages[index];
    pages.splice(index, 1);
    await db.pages.delete(pageTitle);
    await db.notes.delete(pageTitle);
    if (currentPageIndex >= index) {
      currentPageIndex--;
    }
    if (pages.length > 0) {
      title = pages[currentPageIndex];
      const noteData = (await db.notes.get(title)) || "";
      note = noteData.note;
    } else {
      title = "";
      note = "";
      addPage();
    }
    pages = pages;
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="grid grid-cols-1 items-center mb-3">
          <button
            on:click={() => selectPage(index)}
            class="{index == currentPageIndex &&
              'bg-dark-gray '} py-2 px-3 text-gray-900 rounded-lg"
            >{page}</button
          >
        </li>
      {/each}
      <hr />
      <li class="text-center hover:text-gray-800">
        <button class="font-medium" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="mb-3">
    <h1
      class="text-2xl font-bold mb-3"
      contenteditable
      bind:textContent={title}
    ></h1>
    <hr />
    <button
      class="relative px-5 py-2.5 overflow-hidden rounded-lg bg-gray-800 mt-3 font-medium text-white text-sm shadow-2xl transition-all duration-300 before:absolute before:inset-0 before:border-0 before:border-white before:duration-100 before:ease-linear hover:bg-white hover:text-gray-800 hover:shadow-gray-800 hover:before:border-[25px]"
      on:click={saveNote}
    >
      <span class="relative z-10">Save</span>
    </button>
    <button
      class="relative mx-2 px-5 py-2.5 overflow-hidden rounded-lg bg-red-500 mt-3 font-medium text-white text-sm shadow-2xl transition-all duration-300 before:absolute before:inset-0 before:border-0 before:border-white before:duration-100 before:ease-linear hover:bg-white hover:text-red-500 hover:shadow-red-500 hover:before:border-[25px]"
      on:click={() => deletePage(currentPageIndex)}
    >
      <span class="relative z-10">Delete</span>
    </button>
  </div>

  <hr />
  <textarea
    class="mt-4 block w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5"
    bind:value={note}
    name="note"
    placeholder="Take a note..."
  ></textarea>
</main>

<style>
  .bg-light-gray {
    background-color: rgb(240, 240, 240);
  }
  .bg-dark-gray {
    background-color: rgb(219, 219, 219);
  }
  .my-svg:hover {
    height: 26px;
    width: 26px;
  }
</style>
