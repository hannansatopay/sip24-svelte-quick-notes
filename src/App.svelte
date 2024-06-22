<<<<<<< Updated upstream
<script>
  import { onMount } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { getNote, saveNoteToDB, deleteNoteFromDB, getAllNotes } from './indexedDB';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    const savedPages = await getAllNotes();
    if (savedPages.length > 0) {
      pages = savedPages.map(page => page.title);
      selectPage(0);  // Select the first page on load
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await deleteNoteFromDB(storedPageName);
    }
    pages[currentPageIndex] = title;
    await saveNoteToDB({ title, note });
    pages = [...pages];  // Trigger reactivity
  }

  function addPage() {
    pages = [...pages, "New Page"];
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = (await getNote(title))?.note || '';
  }

  async function deleteNote() {
    const pageToDelete = pages[currentPageIndex];
    await deleteNoteFromDB(pageToDelete);
    pages = pages.filter((_, i) => i !== currentPageIndex);
    
    if (pages.length === 0) {
      addPage();
    } else {
      const newIndex = currentPageIndex > 0 ? currentPageIndex - 1 : 0;
      selectPage(newIndex);
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen" in:slide={{ duration: 300 }} out:slide={{ duration: 300 }}>
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={() => selectPage(index)} class="{index == currentPageIndex ? 'bg-sky-blue' : 'bg-light-gray'} py-2 px-3 text-gray-900 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">{page}</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium transition duration-300 ease-in-out transform hover:scale-105">+ Add Page</button>
=======
<!-- <script>
  import { db } from "./db";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  let pages = writable([]);
  let unsavedPages = writable([]);
  let currentPageIndex = -1;
  let title = "New Note";
  let note = "";

  const saveNote = async () => {
    if (currentPageIndex === -1) return;

    const isUnsaved = $unsavedPages.includes(currentPageIndex);
    if (isUnsaved) {
      const newNote = {
        title: title,
        content: note,
      };
      await db.notes.add(newNote);
      unsavedPages.update((unsaved) =>
        unsaved.filter((index) => index !== currentPageIndex)
      );
      fetchNotes();
    } else {
      const id = $pages[currentPageIndex].id;
      await db.notes.update(id, { title, content: note });
      fetchNotes();
    }
  };

  function addNote() {
    pages.update((pages) => {
      pages.push({ title: "New Note", content: "" });
      return pages;
    });
    unsavedPages.update((unsaved) => {
      unsaved.push($pages.length - 1);
      return unsaved;
    });
    selectNote($pages.length - 1);
    note = "";
  }

  const deleteNote = async (index) => {
    if ($unsavedPages.includes(index)) {
      unsavedPages.update((unsaved) => unsaved.filter((idx) => idx !== index));
      pages.update((pages) => pages.filter((_, idx) => idx !== index));
    } else {
      const id = $pages[index].id;
      await db.notes.delete(id);
      fetchNotes();
    }

    if (currentPageIndex === index) {
      currentPageIndex = -1;
      title = "New Note";
      note = "";
    }
  };

  function selectNote(index) {
    currentPageIndex = index;
    if ($pages[index]) {
      title = $pages[index].title;
      note = $pages[index].content;
    }
  }

  const fetchNotes = async () => {
    const storedNotes = await db.notes.toArray();
    pages.set(storedNotes);
  };

  onMount(fetchNotes);
</script>

<aside class="w-60 top-0 left-0 h-screen fixed">
  <div
    class="bg-gray-50 px-2.5 py-5 h-full overflow-y-auto border-r border-gray-200"
  >
    <ul class="space-y-2">
      {#each $pages as page, index}
        <li
          class="{index === currentPageIndex
            ? 'bg-gray-300'
            : 'bg-gray-100'} rounded-lg hover:bg-gray-200"
        >
          <button
            on:click={() => selectNote(index)}
            class="px-3 py-2 text-gray-900 w-4/5 text-left">{page.title}</button
          >
          <button
            class="w-auto hover:bg-gray-400 px-3 rounded-lg"
            on:click={() => deleteNote(index)}>X</button
          >
        </li>
      {/each}
      <li class="text-center">
        <button class="hover:bg-gray-200 rounded-lg p-1" on:click={addNote}
          >+ New Note</button
        >
>>>>>>> Stashed changes
      </li>
    </ul>
  </div>
</aside>

<<<<<<< Updated upstream
<main class="p-4 ml-60 h-auto transition-opacity duration-300 ease-in-out" in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
  <div class="grid grid-cols-3 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-sky-blue text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-light-sky-blue transition duration-300 ease-in-out transform hover:scale-105" on:click={saveNote}>Save</button>
    <button class="ml-3 bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-500 transition duration-300 ease-in-out transform hover:scale-105" on:click={deleteNote}>Delete</button>
  </div>
  <hr />
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5 transition-transform duration-300 ease-in-out transform hover:scale-101" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #F5F5F5;
  }

  .bg-dark-gray {
    background: #E5E7EB; /* Changed to a minimalistic gray for visibility */
  }

  .bg-sky-blue {
    background: #87CEEB;
  }

  .hover\:scale-101:hover {
    transform: scale(1.01);
  }

  .hover\:bg-light-sky-blue:hover {
    background: #B0E0E6;
  }

  .bg-red-600 {
    background: #dc2626;
  }

  .hover\:bg-red-500:hover {
    background: #ef4444;
  }
</style>

=======
<main class="p-4 space-y-2 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1
      class="font-bold text-3xl p-1"
      contenteditable
      bind:textContent={title}
    ></h1>
    <button
      class="bg-gray-900 text-white px-3 ml-auto py-2.5 rounded-lg font-medium text-sm hover:bg-gray-700"
      on:click={saveNote}>Save</button
    >
  </div>
  <textarea
    name="noteContent"
    id="noteContent"
    class="w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={note}
  ></textarea>
</main> -->

<!-- Using Local Storage -->

<script>
  import { onMount } from "svelte";
  console.log(localStorage.getItem("pages"));
  var pages = localStorage.getItem("pages")
    ? JSON.parse(localStorage.getItem("pages"))
    : ["New Note"];
  let currentPageIndex = 0;
  let title = "New Note";
  let note = "";
  let isToggle = false;
  let newNote = false;
  let updateNote = false;

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    // @ts-ignore
    if (savedPages && JSON.parse(savedPages).length !== 0) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    } else {
    }
  });

  function newNoteToggle() {
    updateNote = false;
    newNote = true;
    console.log("New Note function", updateNote, newNote)
  }

  function updateNoteToggle() {
    updateNote = true;
    newNote = false;
    console.log("Update Note function", updateNote, newNote)
  }

  function addNote() {
    // @ts-ignore
    pages.push("New Note");
    selectNote(pages.length ? pages.length - 1 : 0);
    note = "";
    isToggle = false;
    newNoteToggle();
  }

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    const savedPages = localStorage.getItem("pages");
    var pagesArr;
    console.log(savedPages);
    if (savedPages) {
      pagesArr = JSON.parse(savedPages);
    } else {
      pagesArr = [];
    }
    if (storedPageName != title && updateNote) {
      console.log("Update");
      pages[currentPageIndex] = title;
      localStorage.removeItem(storedPageName);
      pagesArr = pagesArr.filter(val => val !== storedPageName);
      pagesArr.push(title);
      console.log(pagesArr);
      localStorage.setItem(title, note);
      localStorage.setItem("pages", JSON.stringify(pagesArr));
      return;
    } else if (newNote) {
      console.log("New");
      pages[currentPageIndex] = title;
      console.log(localStorage.getItem("pages"));
      pagesArr.push(title);
      localStorage.setItem(title, note);
      localStorage.setItem("pages", JSON.stringify(pagesArr));
    }
    // var tempPages;
    // if (storedPageName != title) {
    //   var filteredArr;
    //   if (savedPages && savedPages.includes(storedPageName)) {
    //     const savedPagesArr = JSON.parse(savedPages);
    //     filteredArr = savedPagesArr.filter((val) => val !== storedPageName);
    //   }
    //   localStorage.removeItem(storedPageName);
    //   // @ts-ignore
    //   pages[currentPageIndex] = title;
    //   localStorage.setItem("pages", JSON.stringify(filteredArr));
    //   return;
    // }
    // if (savedPages && JSON.parse(savedPages).length !== 0) {
    //   tempPages = JSON.parse(savedPages);
    //   tempPages.removeItem(storedPageName);
    //   console.log(tempPages);
    // } else {
    //   tempPages = [];
    // }
    // localStorage.setItem(title, note);
    // tempPages.push(title);
    // localStorage.setItem("pages", JSON.stringify(tempPages));
  }

  function deleteNote(index) {
    const storedPages = localStorage.getItem("pages");
    const storedPagesArr = JSON.parse(storedPages);
    console.log(index);
    const storedPageName = pages[index];
    const beforeIndexElements = pages.slice(0, index);
    const afterIndexElements = pages.slice(index + 1);
    if (storedPagesArr && storedPagesArr.includes(storedPageName)) {
      const beforeIndexStoredElements = storedPagesArr.slice(0, index);
      const afterIndexStoredElements = storedPagesArr.slice(index + 1);
      const newStoredPages = beforeIndexStoredElements.concat(
        afterIndexStoredElements
      );
      localStorage.setItem("pages", JSON.stringify(newStoredPages));
      localStorage.removeItem(storedPageName);
    }
    // @ts-ignore
    pages = beforeIndexElements.concat(afterIndexElements);
    console.log(pages);
    title = "New Note";
    note = "";
  }

  function selectNote(index) {
    updateNoteToggle();
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
    isToggle = false;
  }

  function toggler() {
    isToggle = !isToggle;
    if (isToggle) {
      document
        .getElementById("outsideSidebar")
        .addEventListener("click", toggler);
    } else {
      document
        .getElementById("outsideSidebar")
        .removeEventListener("click", toggler);
    }
  }
</script>

<aside
  class="w-12 bg-gray-800 h-screen fixed top-0 left-0 grid grid-cols-1 p-2"
>
  <button
    class="bg-gray-500 rounded-lg h-12 text-center font-bold text-2xl inline-block align-middle hover:shadow-md hover:shadow-[#00ff37] hover:bg-[#00ff37] text-[#00ff37]"
    on:click={toggler}>+</button
  >
</aside>

<aside class="top-0 left-0 h-screen fixed hidden w-12 sm:block sm:w-48 md:w-60">
  <div
    class="bg-gray-800 px-2.5 py-5 h-full overflow-y-auto border-r border-gray-600 shadow-lg shadow-[#00ff37]"
  >
    <ul class="space-y-2">
      <li class="text-center">
        <button
          class="hover:shadow-md hover:shadow-lime-700 rounded-lg px-2 text-[#00ff37] border border-[#00ff37] font-mono"
          on:click={addNote}>+ New Note</button
        >
      </li>
      <hr />
      {#each pages as page, index}
        <li
          class="{index == currentPageIndex
            ? ' bg-[#00ff37]'
            : ' bg-[#2b9e46]'} rounded-lg flex justify-between items-center"
        >
          <button
            on:click={() => selectNote(index)}
            class="flex-grow pl-3 py-2 text-gray-900 text-left font-mono"
            >{page}</button
          >
          <button
            class="hover:text-[#ff0000] right-0 rounded-lg font-bold w-10"
            on:click={() => deleteNote(index)}>X</button
          >
        </li>
      {/each}
    </ul>
  </div>
</aside>

<main class="p-4 space-y-2 ml-12 sm:ml-48 md:ml-60 bg-gray-900 h-screen">
  <div class="mb-3">
    <h1
      class="font-bold text-3xl p-1 text-[#00ff37] font-mono"
      contenteditable
      bind:textContent={title}
    ></h1>
  </div>
  <textarea
    name="noteContent"
    id="noteContent"
    class="w-full bg-white border border-gray-300 rounded-lg text-gray-900 p-2.5 font-mono shadow-md shadow-[#00ff37] h-[100px]"
    bind:value={note}
  ></textarea>
  <button
    class="bg-white text-gray-900 px-5 ml-auto py-2 rounded-lg font-medium text-md hover:bg-[#00ff37] font-mono shadow-md shadow-[#00ff37]"
    on:click={saveNote}>SAVE</button
  >
</main>

<aside class={isToggle ? "visible" : "hidden"}>
  <div
    class="bg-gray-800 px-2.5 py-5 h-full overflow-y-auto shadow-lg border-l border-[#00ff37]"
  >
    <ul class="space-y-2">
      <li class="text-center">
        <button
          class="hover:shadow-md hover:shadow-lime-700 rounded-lg px-2 text-[#00ff37] border border-[#00ff37] font-mono"
          on:click={addNote}>+ New Note</button
        >
      </li>
      <hr />
      {#each pages as page, index}
        <li
          class="{index == currentPageIndex
            ? ' bg-[#00ff37]'
            : ' bg-[#2b9e46]'} rounded-lg flex justify-between items-center"
        >
          <button
            on:click={() => selectNote(index)}
            class="flex-grow pl-3 py-2 text-gray-900 text-left font-mono w-auto overflow-x-hidden"
            >{page}</button
          >
          <button
            class="hover:text-[#ff0000] right-0 rounded-lg font-bold min-w-7"
            on:click={() => deleteNote(index)}>X</button
          >
        </li>
      {/each}
    </ul>
  </div>
</aside>

<main class={isToggle ? "sidebarBg" : "hidden"} id="outsideSidebar">
  <!-- Temporary filling -->
</main>

<!-- <style>
  /* Add your styles here */
</style> -->

<style>
  .visible {
    display: block;
    width: 40vw;
    height: 100vh;
    background-color: rgb(75 85 99);
    top: 0;
    left: 48px;
    position: fixed;
  }
  .sidebarBg {
    display: block;
    width: calc(100vw - 40vw - 48px);
    height: 100vh;
    top: 0;
    left: calc(40vw + 48px);
    position: fixed;
    background-color: white;
    opacity: 0.2;
  }
  @media (min-width: 640px) {
    .visible,
    .sidebarBg {
      display: none;
    }
  }
</style>
>>>>>>> Stashed changes
