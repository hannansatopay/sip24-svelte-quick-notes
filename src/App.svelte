<script>
  import { onMount } from "svelte";

  let pages = [];
  let currentPageIndex = 0;
  let name = "";
  let note = "";

  function saveNotes() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== name) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = name;
    }
    localStorage.setItem(name, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      name = pages[currentPageIndex] || "New Page";
      note = localStorage.getItem(name) || "";
    } else {
      addPage();
    }
  });

  function addPage() {
    pages.push("New Page");
    selectPage(pages.length - 1);
  }

  function selectPage(index) {
    currentPageIndex = index;
    name = pages[currentPageIndex];
    note = localStorage.getItem(name) || "";
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-auto py-5 px-3 border-r h-full border-gray-500">
    <ul class="space-y-3">
      {#each pages as page, index}
        <li>
          <button
            on:click={() => selectPage(index)}
            class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 h-full border-r border-gray-300 rounded-lg"
          >
            {page}
          </button>
        </li>
      {/each}
      <li class="text-center">
        <button class="font-medium font-bold p-3" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mt-2 mb-3">
    <h1
      class="text-2xl strong font-mono text-gray-600 font-bold"
      contenteditable
      bind:textContent={name}
    ></h1>
    <button
      class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 strong hover:bg-gray-950"
      on:click={saveNotes}
    >
      Save
    </button>
  </div>
  <hr />
  <input
    class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-950"
    bind:value={name}
    type="text"
    placeholder="Create new"
  />
  <textarea
    class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-950 mt-3"
    bind:value={note}
    placeholder="Write Here"
  ></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }
  .bg-dark-gray {
    background: #cbc9c9;
  }
</style>
