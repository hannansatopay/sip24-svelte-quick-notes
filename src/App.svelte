<script>
  import { onMount } from "svelte";

  let pages = [];
  let currentPageIndex = 0;
  let title = "New Note";
  let note = "Today is an excellent day!";

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    } else addPage();
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
    pages.push("New Page");
    selectPage(pages.length ? pages.length - 1 : 0);
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }

  function deletePage(index) {
    const storedPageName = pages[index];
    let newPages = pages.slice(0, index);
    let newPages2 = pages.slice(index + 1, pages.length);
    pages = newPages.concat(newPages2);
    localStorage.setItem("pages", JSON.stringify(pages));
    localStorage.removeItem(storedPageName);
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
              : ''} py-2 px-3 text-gray-900 rounded-lg"
          >
            {page}
          </button>
          <button on:click={() => deletePage(index)} class="cross"></button>
        </li>
      {/each}
      <li class="text-center">
        <button class="font-medium" on:click={addPage}>+Add Page</button>
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
      class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900 w-20 ml-auto"
      on:click={saveNote}>Save</button
    >
  </div>
  <hr />
  <textarea
    class="block w-full mt-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={note}
    placeholder="Enter your note"
  ></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }
  .bg-dark-gray {
    background: #efefef;
  }
  .cross {
    z-index: 1000;
    display: inline-block;
    width: 15px;
    height: 15px;
    color: black;
    border: 2px solid black;
    border-radius: 50%;
    position: relative;
    top: -1.5em;
    left: -0.8em;
  }
  .cross:before,
  .cross:after {
    position: absolute;
    left: 5px;
    top: 0.5px;
    content: " ";
    height: 10px;
    width: 2px;
    background-color: #333;
  }
  .cross:before {
    transform: rotate(45deg);
  }
  .cross:after {
    transform: rotate(-45deg);
  }
</style>
