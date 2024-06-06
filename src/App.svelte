<script>
  import { onMount } from "svelte";
  import { getAllPages, saveNote, getNote, deleteNote } from "./db.js";

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  onMount(async () => {
    pages = await getAllPages();
    if (pages.length > 0) {
      await handleSelectPage(0);
    } else {
      await handleAddPage();
    }
  });

  const handleSaveNote = async () => {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title) {
      await deleteNote(storedPageName);
      pages[currentPageIndex] = title;
    }
    await saveNote(title, note);
    pages = await getAllPages();
  };

  const handleAddPage = async () => {
    const newTitle = `New Page ${pages.length+1}`;
    pages.push(newTitle);
    currentPageIndex = pages.length - 1;
    title = newTitle;
    note = '';
    await saveNote(title, note);
    pages = await getAllPages();
  };

  const handleSelectPage = async (index) => {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = await getNote(title);
  };

  const handleDeletePage = async (index) => {
    const pageToDelete = pages[index];
    await deleteNote(pageToDelete);
    pages.splice(index, 1);

    if (pages.length > 0) {
      currentPageIndex = Math.min(currentPageIndex, pages.length - 1);
      await handleSelectPage(currentPageIndex);
    } else {
      await handleAddPage();
    }
    pages = await getAllPages();
  };
</script>

<aside class="fixed top-0 left-3 z-40 w-60 h-screen">
  <div class="bg-light-yellow overflow-y-auto py-5 px-3 h-full border-r border-pink-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex items-center">
          <button
            on:click={() => handleSelectPage(index)}
            class="{index == currentPageIndex ? 'bg-dark-gray' : ''} rounded-lg py-3 px-3 text-gray-900 flex-grow">{page}</button>
          <button
            on:click={() => handleDeletePage(index)}
            class="ml-3 bg-pink-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-yellow-700">Delete</button>
        </li>
      {/each}
      <li class="text-right">
        <button on:click={handleAddPage} class="font-medium">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 bg-gray-600 h-screen">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1
      class="text-3xl font-bold"
      contenteditable
      bind:textContent={title}
    ></h1>
    <button
      class="bg-gray-600 ml-auto text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-yellow-700"
      on:click={handleSaveNote}>Save</button>
  </div>
  <hr />
  <textarea
    class="mt-3 block w-full bg-blue-100 border border-black-300 rounded-lg text-black-900 p-2.5"
    bind:value={note}
  ></textarea>
</main>

<style>
  .bg-light-yellow {
    background: #dee6c1;
  }

  .bg-dark-gray {
    background: #979595;
  }

  h1 {
    font-weight: 700;
  }
</style>