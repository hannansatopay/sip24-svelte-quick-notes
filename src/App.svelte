<script>
  import { onMount } from "svelte";
  import db from "./db"; // Import dexie database form db.js

  let pages = []; 
  let currentPageIndex = 0; 
  let title = ""; 
  let note = ""; 

  // Function to run when the component is mounted
  onMount(async () => {
    pages = await db.notes.toArray(); // load all the page from db
    if (pages.length > 0) {
      selectPage(0); // first page will be selected if no page exiest
    } else {
      addPage(); // Add new page if no page exited in the first palace 
    }
  });

  // To dave current note 
  async function saveNote() {
    const storedPage = pages[currentPageIndex];
    if (storedPage.title !== title) {
      await db.notes.delete(storedPage.id);
      pages[currentPageIndex].title = title;
    }
    await db.notes.put({ id: storedPage.id, title, content: note });
    pages = await db.notes.toArray();
  }

  // For adding new pages
  async function addPage() {
    const newPage = { title: "New Page", content: "" };
    const id = await db.notes.add(newPage);
    newPage.id = id;
    pages.push(newPage);
    selectPage(pages.length - 1); // Select the newly added page
  }

  // Function to select a page by index
  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].content;
  }

  // Function to delete the current page
  async function deletePage() {
    const pageToDelete = pages[currentPageIndex];
    await db.notes.delete(pageToDelete.id);
    pages = pages.filter((page) => page.id !== pageToDelete.id);
    if (pages.length === 0) {
      addPage();
    } else {
      selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
    }
  }

</script>


<body>
  <aside class="fixed top-0 left-0 w-60 h-screen z-40">
    <div
      class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200 second_color"
    >
      <ul class="space-y-2 items-center">
        {#each pages as page, index}
          <li class="ml-2 flex items-center justify-between">
            <button
              on:click={() => selectPage(index)}
              class="{index == currentPageIndex
                ? 'bg-dark-gray'
                : ''} py-2 px-3 rounded-lg text-gray-900">{page.title}</button
            >
            <button on:click={() => deletePage()}>
              <img
                class="size-6"
                src="https://cdn-icons-png.freepik.com/512/3807/3807871.png"
                alt="Delete"
              />
            </button>
          </li>
        {/each}
        <li class="text-center">
          <button class="font-medium" on:click={addPage}> + Add Page </button>
        </li>
      </ul>
    </div>
  </aside>

  <main class="p-4 ml-60 h-screen first_color">
    <div class="grid grid-cols-2 items-center mb-3">
      <h1
        placeholder="Title"
        class="text-3xl font-bold"
        contenteditable
        bind:textContent={title}
      ></h1>
      <button
        class="bg-gray-800 text-white px-4 py-2.5 rounded-lg ml-auto"
        on:click={saveNote}>Save</button
      >
    </div>
    <hr />

    <textarea
      class="w-full h-56 mt-3 bg-gray-100 border border-gray-300 rounded-lg"
      name=""
      placeholder="Content......"
      id=""
      bind:value={note}
    ></textarea>
  </main>
</body>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }
  .bg-dark-gray {
    background: #efefef;
  }
  .first_color {
    background: #ececec;
  }
  .second_color {
    background: #9fd3c7;
  }
  .third_color {
    background: #385170;
  }
  .fourth_color {
    background: #142d4c;
  }
  textarea {
    transition: box-shadow 0.3s ease-in-out;
    border: none;
  }

  textarea:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(5, 209, 203, 0.5);
  }
</style>
