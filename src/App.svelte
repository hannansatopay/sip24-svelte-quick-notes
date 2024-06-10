<script>
  import { onMount } from "svelte";
  import Dexie from "dexie";

  let db;
  let pages = [];
  let currentPageIndex = 0;

  let title = "";
  let note = "";

  onMount(async () => {
    db = new Dexie("notesDatabase");
    db.version(1).stores({
      pages: "++id, title",
      notes: "++id, title, content",
    });

    const savedPages = await db.table("pages").toArray();
    if (savedPages.length) {
      pages = savedPages.map((page) => page.title);
      title = pages[currentPageIndex];
      const savedNote = await db.table("notes").where({ title }).first();
      note = savedNote ? savedNote.content : "";
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title) {
      await db.pages.where({ title: storedPageName }).delete();
      pages[currentPageIndex] = title;
      await db.pages.add({ title });
    }
    await db.notes.put({ title, content: note });
  }

  async function addPage() {
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
    await db.pages.add({ title: "New Page" });
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    const savedNote = await db.notes.where({ title }).first();
    note = savedNote ? savedNote.content : "";
  }

  async function deletePage() {
    const pageTitle = pages[currentPageIndex];
    await db.pages.where({ title: pageTitle }).delete();
    await db.notes.where({ title: pageTitle }).delete();
    pages.splice(currentPageIndex, 1);
    if (pages.length > 0) {
      selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
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
              : ''} py-2 px-3 text-gray-900 rounded-lg w-52">{page}</button
          >
        </li>
      {/each}
      <li class="text-center">
        <button class="font-medium hover:text-gray-700" on:click={addPage}
          >+ Add Page</button
        >
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-3 items-center mb-3">
    <h1
      class="text-2xl font-bold col-span-2"
      contenteditable
      bind:textContent={title}
    >
      {title || "New Page"}
    </h1>
    <div class="flex justify-end space-x-2">
      <button
        class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900"
        on:click={saveNote}>Save</button
      >
      <button
        class="ml-auto bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-800"
        on:click={deletePage}>Delete</button
      >
    </div>
  </div>
  <div class="grid grid-cols-2 items-center mb-3"></div>
  <hr />
  <textarea
    class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={note}
    placeholder="Type here...."
  ></textarea>
</main>

<style>
  .bg-light-gray {
    background: #cccccc;
  }
  .bg-dark-gray {
    background: #aaaaaa;
  }
</style>
