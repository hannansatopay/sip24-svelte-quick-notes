<script lang="ts">
  import { onMount } from "svelte";
  import {
    addPage,
    deletePage,
    getAllPages,
    getPage,
    openDB,
    updatePage,
  } from "./db";
  let pages: string[] = [];
  let title: string = "";
  let note: string = "";
  let currentPageIndex: number = 0;
  onMount(async () => {
    await openDB();
    const savedPages = await getAllPages();
    if (savedPages.length > 0) {
      pages = savedPages.map((page) => page.title);
      currentPageIndex = 0;
      title = pages[currentPageIndex];
      note = (await getPage(title))?.note || "";
    } else {
      handleAddPage();
    }
  });
  const handleSavePage = async () => {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await deletePage(storedPageName);
      pages[currentPageIndex] = title;
    }
    await updatePage(title, note);
  };
  const handleDeletePage = async () => {
    const currentPage = pages[currentPageIndex];
    await deletePage(currentPage);
    pages = pages.filter((page) => page !== currentPage);
    if (pages.length > 0) {
      handleSelectPage(0);
    } else {
      title = "";
      note = "";
      currentPageIndex = 0;
    }
  };
  function handleAddPage() {
    const newPageTitle = "New Page";
    pages = [...pages, newPageTitle];
    handleSelectPage(pages.length - 1);
    addPage(newPageTitle, "");
  }
  const handleSelectPage = async (index: number) => {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = (await getPage(title))?.note || "";
  };
</script>

<aside class="fixed top-0 left-0 w-60 h-screen bg-gray-900 text-gray-200">
  <ul class="p-4">
    {#each pages as page, index}
      <li class="mb-2">
        <button
          class="w-full p-2 bg-gray-800 hover:bg-gray-700 rounded"
          on:click={() => handleSelectPage(index)}>{page}</button
        >
      </li>
    {/each}
    <li>
      <button
        class="w-full p-2 bg-blue-600 hover:bg-blue-500 rounded mt-4"
        on:click={handleAddPage}>Add Page</button
      >
    </li>
  </ul>
</aside>

<main class="ml-60 p-6 bg-gray-800 text-gray-200 h-screen">
  <h1
    contenteditable
    class="text-2xl mb-4 p-2 bg-gray-700 rounded"
    bind:textContent={title}
  >
    {title}
  </h1>
  <textarea
    class="w-full h-64 p-4 bg-gray-700 text-gray-200 rounded mb-4"
    bind:value={note}
  ></textarea>
  <div class="flex space-x-4">
    <button
      class="p-2 bg-green-600 hover:bg-green-500 rounded"
      on:click={handleSavePage}>Save</button
    >
    <button
      class="p-2 bg-red-600 hover:bg-red-500 rounded"
      on:click={handleDeletePage}>Delete</button
    >
  </div>
</main>