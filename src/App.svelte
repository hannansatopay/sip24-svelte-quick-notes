<script>
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
      </li>
    </ul>
  </div>
</aside>

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
</main>

<!-- Using Local Storage -->

<!-- <script>
  import { onMount } from "svelte";
  var pages = localStorage.getItem("pages")
    ? localStorage.getItem("pages")
    : [];
  let currentPageIndex = 0;
  let title = "New Note";
  let note = "";
  console.log(pages);

  onMount(() => {
    const savedPages = localStorage.getItem("pages");
    console.log(typeof(savedPages));
    if (savedPages) {
      pages = JSON.parse(savedPages);
      title = pages[currentPageIndex];
      note = localStorage.getItem(title);
    }
    // else {
    //   addNote();
    // }
  });

  function addNote() {
    pages.push("New Note");
    selectNote(pages.length ? pages.length - 1 : 0);
    note = "";
  }

  function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName != title) {
      localStorage.removeItem(storedPageName);
      pages[currentPageIndex] = title;
    }
    localStorage.setItem(title, note);
    localStorage.setItem("pages", JSON.stringify(pages));
  }

  function deleteNote(index) {
    const storedPages = localStorage.getItem("pages");
    const storedPagesArr = JSON.parse(storedPages);
    console.log(storedPages);
    const storedPageName = pages[index];
    const beforeIndexElements = pages.slice(0, index);
    const afterIndexElements = pages.slice(index + 1);
    if (storedPagesArr.includes(storedPageName)) {
      const beforeIndexStoredElements = storedPagesArr.slice(0, index);
      const afterIndexStoredElements = storedPagesArr.slice(index + 1);
      const newStoredPages = beforeIndexStoredElements.concat(
        afterIndexStoredElements
      );
      localStorage.setItem("pages", JSON.stringify(newStoredPages));
      localStorage.removeItem(storedPageName);
    }
    pages = beforeIndexElements.concat(afterIndexElements);
    console.log(pages);
    title = "New Note";
    note = "";
  }

  function selectNote(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    note = localStorage.getItem(title);
  }
</script>

<aside class="w-60 top-0 left-0 h-screen fixed">
  <div
    class="bg-gray-50 px-2.5 py-5 h-full overflow-y-auto border-r border-gray-200"
  >
    <ul class="space-y-2">
      {#each pages as page, index}
        <li
          class="{index == currentPageIndex
            ? 'bg-gray-300'
            : 'bg-gray-100'} rounded-lg hover:bg-gray-200"
        >
          <button
            on:click={() => selectNote(index)}
            class="px-3 py-2 text-gray-900 w-4/5 text-left">{page}</button
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
      </li>
    </ul>
  </div>
</aside>

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
</main>

<style>
</style> -->

<style>
  /* Add your styles here */
</style>
