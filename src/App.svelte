<script>
  import { onMount } from "svelte";
  let pages = [];
  let currentPageIndex = 0;
  let title;
  let note = "Today is Tuesday!";
  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    } else {
      addPage();
    }
  });
  function savenote() {
    const currentPageTitle = pages[currentPageIndex];
    if (currentPageTitle != title) {
      localStorage.removeItem(currentPageTitle);
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

  function deleteNote() {
    console.log(currentPageIndex);
    const currentPageTitle = pages[currentPageIndex];
    if (currentPageIndex != pages.length - 1) {
      for (let i = currentPageIndex; i < pages.length; i++) {
        pages[i] = pages[i + 1];
      }
      pages.splice(pages.length - 1, 1);
      localStorage.removeItem(currentPageTitle);
      selectPage(pages.length ? pages.length - 1 : null);
      localStorage.setItem("pages", JSON.stringify(pages));
    } else {
      pages.splice(currentPageIndex, 1);
      localStorage.removeItem(currentPageTitle);
      localStorage.setItem("pages", JSON.stringify(pages));
      selectPage(pages.length ? pages.length - 1 : null);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <h1>NOTES APP</h1>
  <div class="overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button
            on:click={() => selectPage(index)}
            class="pagebtn {index == currentPageIndex
              ? 'bg-dark-gray'
              : 'custom-color-sidebtn'} py-2 px-3 text-gray-900 rounded-lg"
            >{page}</button
          >
        </li>
      {/each}
      <li class="text-center">
        <button
          class="custom-color-sidebtn pagebtn font-medium py-2 px-3 text-gray-900 rounded-lg"
          on:click={addPage}>+ Add page</button
        >
      </li>
    </ul>
  </div>
</aside>

<main class="mainbody overflow-y-auto p-4 ml-60 h-screen">
  <div class="mainbody grid grid-cols-2 iems-center h-auto">
    <div>
      <h1
        class="text-3xl font-bold"
        contenteditable
        bind:textContent={title}
      ></h1>
    </div>
    <div class="divsavedelete">
      <button
        class="ml-auto mr-2 bg-gray-800 text-white px-8 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-500"
        on:click={savenote}>Save</button
      >
      <button
        class="ml-0 bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-500"
        on:click={deleteNote}>Delete</button
      >
    </div>
  </div>
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

  .pagebtn:hover {
    background: #efefef;
  }

  aside {
    background: rgb(71, 26, 119);
  }

  .custom-color-sidebtn {
    background: #987abf;
  }
  body {
    background-color: #744ef0;
  }
  .mainbody {
    background: #744ef0;
  }
  aside h1 {
    text-align: center;
    color: white;
    font-size: 1.5rem;
    padding-top: 1em;
    font-weight: 900;
  }
  aside ul {
    text-align: center;
  }

  .divsavedelete {
    display: flex;
    text-align: right;
  }
</style>
