<script>
  import { onMount } from "svelte";

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex] || "New page";
      note = localStorage.getItem(title);
    } else {
      addPage();
    }
  });

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }
  function addPage() {
    pages.push("New page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }
  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }
  function deletePage(index) {
    console.log(index);
    title = pages[index];
    pages.splice(index, 1);
    localStorage.setItem("pages", JSON.stringify(pages));
    localStorage.removeItem(title);
    if (index == currentPageIndex) {
      selectPage(currentPageIndex - 1);
    } else {
      selectPage(currentPageIndex);
      pages = JSON.parse(localStorage.getItem("pages"));
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div
    class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200"
  >
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="w-auto flex justify-between">
          <button
            class="{index == currentPageIndex
              ? 'bg-dark-gray font-medium'
              : ''} py-2 px-3 text-gray-900 rounded-lg"
            on:click={() => selectPage(index)}>{page}</button
          >
          <button
            class="my-2 mx-3 text-red-600 rounded-lg hover:underline"
            on:click={() => deletePage(index)}>Delete</button
          >
        </li>
      {/each}

      <li class="text-center">
        <button class="font-medium" on:click={addPage}>+ Add page</button>
      </li>
    </ul>
  </div>
</aside>
<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center">
    <h1
      contenteditable
      class="text-3xl font-bold"
      bind:textContent={title}
    ></h1>
    <button
      class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900"
      on:click={saveNote}>Save</button
    >
    <hr />
  </div>
  <textarea
    class="block w-full mt-3 bg-gray-50 border border-gray-300 rounded-lg test-gray-900 p-2.5"
    bind:value={note}
  ></textarea>
</main>

<style>
  .bg-light-gray {
    background-color: #fbfbfb;
  }

  .bg-dark-gray {
    background-color: #efefef;
  }
</style>
