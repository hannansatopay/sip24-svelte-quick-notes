<script>
  import { onMount } from "svelte";
  import { openDB } from "idb";

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  onMount(async () => {
    db = await openDB("notesDB", 1, {
      upgrade(db) {
        db.createObjectStore("notes", { keyPath: "title" });
        db.createObjectStore("pages", { keyPath: "id", autoIncrement: true });
      },
    });

    const tx = db.transaction("pages", "readonly");
    const store = tx.objectStore("pages");
    const allPages = await store.getAll();
    pages = allPages.map((page) => page.title);

    if (pages.length > 0) {
      selectPage(0);
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title) {
      await db.delete("notes", storedPageName);
      pages[currentPageIndex] = title;
    }
    await db.put("notes", { title, note });
    await db.put("pages", { id: currentPageIndex + 1, title });
  }

  async function addPage() {
    const newPage = "New Page";
    pages = [...pages, newPage];
    currentPageIndex = pages.length - 1;
    title = newPage;
    note = "";
    await saveNote();
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const savedNote = await db.get("notes", title);
    note = savedNote ? savedNote.note : "";
  }

  async function deleteNote() {
    const storedPageName = pages[currentPageIndex];
    await db.delete("notes", storedPageName);
    pages = pages.filter((_, index) => index !== currentPageIndex);
    await db.delete("pages", currentPageIndex + 1);

    if (pages.length > 0) {
      currentPageIndex = Math.min(currentPageIndex, pages.length - 1);
      title = pages[currentPageIndex];
      note = await db.get("notes", title).then((n) => (n ? n.note : ""));
    } else {
      addPage();
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
            class="{index == currentPageIndex
              ? 'bg-dark-gray'
              : ''} py-2 px-3 text-gray-900 rounded-lg"
          >
            {page}
          </button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1
      class="text-3xl font-bold"
      contenteditable
      bind:textContent={title}
    ></h1>
    <button
      class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900"
      on:click={deleteNote}>Delete</button
    >
    <button
      class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900"
      on:click={saveNote}>Save</button
    >
  </div>
  <hr />
  <textarea
    class="mt-3 block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={note}
  ></textarea>
</main>

<style>
  .bg-light-gray {
    background: #ccc;
  }
  .bg-dark-gray {
    background: #efefef;
  }
</style>
