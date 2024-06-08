<script>
  import { onMount } from "svelte";

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex] || "New Page";
      note = localStorage.getItem(title) || "";
    } else {
      addPage();
    }
    title = localStorage.getItem("title") || "";
    note = localStorage.getItem("note") || "";
  });

  let pages = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      localStorage.removeItem(storedPageName);
    }
    pages[currentPageIndex] = title;
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  function deletePage(index) {
    const pageToDelete = pages[index];
    pages.splice(index, 1);
    localStorage.removeItem(pageToDelete);
    localStorage.setItem("pages", JSON.stringify(pages));

    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(index > 0 ? index - 1 : 0);
    }
    pages = pages
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title) || "";
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div
    class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200"
  >
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button
            on:click={() => selectPage(index)}
            class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg"
          >{page}</button>
          <button
            on:click={() => deletePage(index)}
            class="ml-2 text-red-600 font-bold"
          >&times;</button>
        </li>
      {/each}
      <li class="text-center font-bold">
        <button class="font-medium" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-2">
    <h1
      class="text-3xl font-bold"
      contenteditable
      bind:textContent={title}
    ></h1>
    <button
      class="bg-gray-800 text-white px-5 py-2 rounded-lg font-medium text-s mt-3 hover:bg-gray-900 ml-auto"
      on:click={saveNote}>Save</button>
  </div>
  <hr />
  <textarea
    class="mt-3 w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
    bind:value={note}
    name=""
    id=""
  ></textarea>
</main>

<style>
  .bg-light-gray {
    background: #e8e8e8;
  }

  .bg-dark-gray {
    background-color: #dddddd;
  }
</style>
