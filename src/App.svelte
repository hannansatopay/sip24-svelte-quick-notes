<script>
  import { onMount } from "svelte";
  import Dexie from "dexie";

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  function initDB() {
    db = new Dexie("notesApp");
    db.version(1).stores({
      pages: "++id, title",
      notes: "title",
    });
  }

  onMount(async () => {
    initDB();
    const allPages = await db.pages.toArray();
    if (allPages.length > 0) {
      pages = allPages.map((page) => page.title);
      title = pages[currentPageIndex];
      const noteObj = await db.notes.get(title);
      note = noteObj ? noteObj.note : "";
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.notes.delete(storedPageName);
      pages[currentPageIndex] = title;
      await db.pages.put({ id: currentPageIndex, title });
    }

    await db.notes.put({ title, note });
  }

  async function addPage() {
    const newPageTitle = "New Page";
    pages.push(newPageTitle);
    const newPageIndex = pages.length - 1;
    await db.pages.put({ id: newPageIndex, title: newPageTitle });
    selectPage(newPageIndex);
  }

  async function deletePage() {
    if (pages.length === 0) return;

    const pageToDelete = pages[currentPageIndex];

    await db.notes.delete(pageToDelete);
    await db.pages.where("title").equals(pageToDelete).delete();

    pages = pages.filter((page) => page !== pageToDelete);

    if (currentPageIndex >= pages.length) {
      currentPageIndex = pages.length - 1;
    }

    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(currentPageIndex);
    }
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const noteObj = await db.notes.get(title);
    note = noteObj ? noteObj.note : "";
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div
    class="bg-pink-500 overflow-y-auto py-5 px-3 h-full border-r border-gray-200"
  >
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button
            id="tpage"
            on:click={() => selectPage(index)}
            class="{index == currentPageIndex
              ? 'bg-dark-gray'
              : ''} py-2 px-3 text-gray-900 bg-cyan-400 rounded-lg"
            >{page}</button
          >
        </li>
      {/each}
      <li class="text-center">
        <button
          class="font-medium py-2 px-4 mt-8 bg-light-green rounded-lg"
          on:click={addPage}>+Add Page</button
        >
      </li>

      <li class="text-center">
        <button
          class="font-medium py-2 px-3 mt4 bg-red rounded-lg"
          on:click={deletePage}>-Delete Page</button
        >
      </li>
    </ul>
  </div>
</aside>

<main
  class="p-4 ml-60 h-auto h-14 bg-gradient-to-r from-violet-400 to-fuchsia-400"
>
  <div class="grid grid-cols-2 items center mb-3">
    <h1
      class="text-3xl p-1 font-bold bg-mint border border-gray-300"
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
    class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5 bg-peach"
    rows="6"
    bind:value={note}
  ></textarea>
</main>

<style>
  .bg-mint {
    background: #e0f2f1;
  }
  .bg-peach {
    background: #ffd8bf;
  }

  .bg-dark-gray {
    background: #efefef;
  }
  .bg-light-green {
    background: greenyellow;
  }
  .bg-red {
    background: red;
  }
</style>
