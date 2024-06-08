<script>
  import { onMount } from "svelte";

  let title = "";
  let text = "";
  let pages = [];
  let currentPage = 0;

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPage];
      text = localStorage.getItem(title);
    } else {
      addPage();
    }
  });

  function save() {
    const storedPage = pages[currentPage];
    if (storedPage != title) {
      localStorage.removeItem(storedPage);
      pages[currentPage] = title;
    }
    localStorage.setItem(title, text);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    pages.push("New Page");
    selectpage(pages.length ? pages.length - 1 : 0);
  }

  function DeletePage() {
    pages.pop();
    pages = pages;
  }

  function selectpage(index) {
    currentPage = index;
    title = pages[currentPage];
    text = localStorage.getItem(title);
  }

  function DeletePageSelect() {
    if (pages.length > 1) {
      localStorage.removeItem(pages[currentPage]);
      pages = pages.filter((_, i) => i !== currentPage);
      localStorage.setItem("pages", JSON.stringify(pages));
      if (currentPage >= pages.length) {
        currentPage = pages.length - 1;
      }
      title = pages[currentPage];
      text = localStorage.getItem(title);
    } else {
      pages = [];
      title = "New Page";
      text = '';
      localStorage.clear();
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
            on:click={() => selectpage(index)}
            class="{index == currentPage
              ? 'bg-gray-100'
              : ''}  py-2.5 px-5 me-2 mb-2 text-s font-medium text-gray-900 focus:outline-none rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 w-full"
            >{page}
          </button>
        </li>
      {/each}
      <li>
        <div class="inline-flex">
          <button
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
            on:click={addPage}
          >
            + Add Pages
          </button>
          <button
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
            on:click={DeletePage}
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center">
    <h3
      class="text-3xl font-bold dark:text-white"
      contenteditable
      bind:textContent={title}
    ></h3>
    <div>
      <button
        class="h-8 min-w-[4rem] rounded-lg border-2 border-emerald-600 bg-emerald-500 text-emerald-50 shadow-lg hover:bg-emerald-600 focus:outline-none focus:ring focus:ring-emerald-600 mt-2 mb-1 ml-auto"
        on:click={save}>Save</button
      >
      <button
        class="h-8 min-w-[4rem] rounded-lg border-2 border-emerald-600 bg-emerald-500 text-emerald-50 shadow-lg hover:bg-emerald-600 focus:outline-none focus:ring focus:ring-emerald-600 mt-2 mb-1 ml-auto"
        on:click={DeletePageSelect}>Delete</button
      >
    </div>
  </div>
  <hr />
  <textarea
    bind:value={text}
    class="mt-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  ></textarea>
</main>

<style>
</style>
