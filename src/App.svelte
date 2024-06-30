<script>
  import { onMount } from "svelte";
  let title = "";
  let note = "";
  let pages = [];
  let currentPageindex = 0;

  onMount(() => {
    const savePages = localStorage.getItem("pages");
    if (savePages) {
      pages = JSON.parse(savePages);
      title = pages[currentPageindex];
      note = localStorage.getItem(title);
    } else {
      addPage();
    }
  });
  function save() {
    console.log(title, note);
    localStorage.setItem("title", title);
    localStorage.setItem("note", note);
  }
  function saveNote() {
    const storedPagename = pages[currentPageindex];
    if (storedPagename != title) {
      localStorage.removeItem(storedPagename);
      pages[currentPageindex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }
  function addPage() {
    pages.push("New page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }
  function selectPage(index) {
    currentPageindex = index;
    title = pages[currentPageindex];
    note = localStorage.getItem(title);
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
            class="{index == currentPageindex
              ? 'bg-dark-gray'
              : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button
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
    <h1
      class="text-2xl font-bold"
      contenteditable
      bind:textContent={title}
    ></h1>
    <button
      class="ml-auto mb-2 bg-gray-800 text-white text-sm mt-2 px-5 py-2.5 rounded-lg hover:bg-gray-900"
      on:click={saveNote}>Save</button
    >
  </div>
  <textarea
    class="block w-full bg-gray-50 border-gray-300 rounded-lg text-gray-900 p-2.5 mt-2"
    bind:value={note}
  ></textarea>
</main>

<style>
  .bg-light-gray {
    background: whitesmoke;
  }
  .bg-dark-gray {
    background: rgb(217, 223, 225);
  }
</style>
