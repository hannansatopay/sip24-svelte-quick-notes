<!-- local storage Db  -->
<!-- <script>
  import { onMount } from "svelte";
  let name = "Sahil Yadav";
  let title = "new Titlt";
  let note = "new note";
  let pages = [];
  let currentPageIndex = 0;
  onMount(() => {
    // title = localStorage.getItem('title')
    // note = localStorage.getItem('note')
    const savedPages = localStorage.getItem("pages");
    if (savedPages) {
      pages = JSON.parse(savedPages); // convert back to string
      title = pages[currentPageIndex] || "New page";
      note = localStorage.getItem(title);
    } else {
      addPage();
    }
  });
  function saveNote() {
    // localStorage.setItem("title",title);
    // localStorage.setItem("note",note);

    const storedPagesName = pages[currentPageIndex];
    if (storedPagesName != title) {
      // updation
      pages[currentPageIndex] = title;
    }

    // pages[currentPageIndex] = title;
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function addPage() {
    pages.push("New Page");
    // pages = pages;
    selectPage(pages.length ? pages.length - 1 : 0);
  }
  function removePage(index) {
    pages.splice(index, 1);
    if (currentPageIndex >= pages.length) currentPageIndex = pages.length - 1;
    selectPage(currentPageIndex);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }
</script> -->


<!-- using a indexDb  -->
<script>
  import { onMount } from "svelte";
  import db from "./DB";

  let name = "Sahil Yadav";
  let title = "New Title";
  let note = "New note";
  let pages = [];
  let currentPageIndex = 0;

  onMount(async () => {
    // Fetch all notes from IndexedDB
    pages = await db.notes.toArray();
    if (pages.length > 0) {
      title = pages[currentPageIndex].title;
      note = pages[currentPageIndex].content;
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPage = pages[currentPageIndex];
    if (storedPage) {
      // Update existing note
      await db.notes.update(storedPage.id, { title, content: note });
      pages[currentPageIndex] = { id: storedPage.id, title, content: note };
    } else {
      // Add new note
      const id = await db.notes.add({ title, content: note });
      pages[currentPageIndex] = { id, title, content: note };
    }
  }

  async function addPage() {
    const newNote = { title: "New Page", content: "" };
    const id = await db.notes.add(newNote);
    pages.push({ id, title: newNote.title, content: newNote.content });
    selectPage(pages.length - 1);
  }

  async function removePage(index) {
    const id = pages[index].id;
    await db.notes.delete(id);
    pages.splice(index, 1);
    if (currentPageIndex >= pages.length) currentPageIndex = pages.length - 1;
    selectPage(currentPageIndex);
  }

  function selectPage(index) {
    currentPageIndex = index;
    const page = pages[currentPageIndex];
    title = page.title;
    note = page.content;
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div
    class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200"
  >
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <!-- <button
            on:click={() => selectPage(index)}
            class="{index == currentPageIndex
              ? 'bg-dark-gray'
              : ''}  py-2 px-3 text-gray-900 rounded-lg">{page}</button
          >
          <button
            on:click={() => removePage(index)}
            class="text-red-500 font-bold py-2 px-3 hover:text-red-700 ml-2"
            >Remove</button
          > -->
           <!-- using database  -->
           <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
           <button on:click={() => removePage(index)} class="text-red-500 font-bold py-2 px-3 hover:text-red-700 ml-2">Remove</button>

        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium">+ Add page</button>
      </li>
    </ul>
  </div>
</aside>
<main class="p-4 ml-60 h-auto">
  <!-- we can use javascript like this  -->
  <!-- <h1>Hello my name is {name}</h1>  -->
  <!-- bind is two way linking   -->

  <div class="grid grid-cols-2 items-center">
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
  <!-- <input class="block w-full bg-gray-50 border border-gray-300 rounded-lg  text-gray-900 p-2.5" bind:value={title} type="text" placeholder="Add title"> -->
  <textarea
    class="mb-3 mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={note}
    placeholder="add description"
  ></textarea>
</main>

<style>
  /* h1{
  color: rebeccapurple;
} */

  .bg-light-gray {
    background: #fbfbfb;
  }
  .bg-dark-gray {
    background: #efefef;
  }
</style>
