<script>
  import { onMount } from "svelte";
  let title = "";
  let note = "";
  let pages = [];
  let currentPageIndex = 0;

  function saveNote() {
    pages[currentPageIndex] = title;
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex] || "New Page";
      note = localStorage.getItem(title);
    } else {
      addPage();
    }
  });

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }
</script>

<aside class="top-0 left-0 fixed z-40 w-60 h-screen">
  <div
    class="bg-gray-100 overflow-y-auto py-5 px-3 h-full border-r border-gray-200"
  >
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button
            on:click={() => selectPage(index)}
            class="bg-gray-300 py-2 px-3 text-gray-900 rounded-lg"
            >{page}</button
          >
        </li>
      {/each}
      <li class="text-center">
        <button class="font-medium" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>
<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}>
      {title || "New Page"}
    </h1>
    <button
      class="ml-auto bg-gray-800 text-white px-5 py-2 rounded-lg text-sm mt-3 hover:bg-gray-900 font-medium"
      on:click={saveNote}>Save</button
    >
  </div>
  <hr />
  <!-- <input
    class="block w-full bg-gray-50 border-gray-400 rounded-lg p-2.5 text-gray-900"
    bind:value={title}
    type="text"
    placeholder="Add Title"
  /> -->
  <textarea
    class="block w-full mt-3 bg-gray-50 border-gray-400 rounded-lg text-gray-900 p-2.5"
    bind:value={note}
  ></textarea>
</main>

<style>
</style>
