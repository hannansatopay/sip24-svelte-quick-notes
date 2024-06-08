<script>
  import { onMount } from "svelte";
  let pages = [];
  let currentpageIndex = 0;
  let title = "";
  let note = "";

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentpageIndex];
      note = localStorage.getItem(title);
    } else {
      addPage();
    }
  });

  function saveNote() {
    const storedPagename = pages[currentpageIndex];
    if (storedPagename !== title) {
      localStorage.removeItem(storedPagename);
      pages[currentpageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    pages.push("new page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  function selectPage(index) {
    currentpageIndex = index;
    title = pages[currentpageIndex];
    note = localStorage.getItem(title);
  }

  function deletePage(index) {
    const pageTitleToDelete = pages[index];
    if (confirm(`Are you sure you want to delete "${pageTitleToDelete}"?`)) {
      localStorage.removeItem(pageTitleToDelete);
      pages.splice(index, 1);
      if (currentpageIndex >= pages.length) {
        currentpageIndex = pages.length - 1;
      }
      if (currentpageIndex < 0) {
        currentpageIndex = 0;
      }
      title = pages[currentpageIndex];
      note = localStorage.getItem(title);
      localStorage.setItem("pages", JSON.stringify(pages));
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
            class="{index == currentpageIndex
              ? 'bg-dark-gray'
              : ''} py-2 px-3 text-gray-900 rounded-lg"
          >
            {page}
          </button>
          <button
            on:click={() => deletePage(index)}
            class="ml-2 text-red-500"
            title="Delete"
          >
            X
          </button>
        </li>
      {/each}

      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1
      class="text-3xl font-bold"
      contenteditable
      bind:textContent={title}
    ></h1>
    <button
      class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900"
      on:click={saveNote}>Save</button
    >
  </div>
  <hr />
  <input
    class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={title}
    type="text"
    placeholder="Add Title"
  />
  <textarea
    class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={note}
  ></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }

  .bg-dark-gray {
    background: #efefef;
  }
</style>
