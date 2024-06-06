<script>
  import { onMount } from "svelte";
  import { openDB } from 'idb';

  let db;
  let pages = [];
  let curr_page_index = 0;
  let title = " ";
  let note = " ";

  async function initDB() {
    db = await openDB('notesDB', 1, {
      upgrade(db) {
        db.createObjectStore('pages', { keyPath: 'id', autoIncrement: true });
        db.createObjectStore('notes', { keyPath: 'title' });
      },
    });
  }

  async function getPages() {
    const tx = db.transaction('pages', 'readonly');
    const store = tx.objectStore('pages');
    const allPages = await store.getAll();
    return allPages.map(page => page.title);
  }

  async function saveNote() {
    const stored_page_name = pages[curr_page_index];
    if (stored_page_name !== title) {
      await db.delete('notes', stored_page_name);
      pages[curr_page_index] = title;
    }
    pages[curr_page_index] = title;
    await db.put('notes', { title, note });

    const tx = db.transaction('pages', 'readwrite');
    const store = tx.objectStore('pages');
    await store.put({ id: curr_page_index + 1, title });
  }

  async function addPage() {
    const newPage = "New Page";
    const tx = db.transaction('pages', 'readwrite');
    const store = tx.objectStore('pages');
    const id = await store.add({ title: newPage });
    pages.push(newPage);
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    curr_page_index = index;
    title = pages[curr_page_index];
    const noteObj = await db.get('notes', title);
    note = noteObj ? noteObj.note : "";
  }

  async function deletePage(index) {
    const pageToDelete = pages[index];
    pages.splice(index, 1);
    await db.delete('notes', pageToDelete);

    const tx = db.transaction('pages', 'readwrite');
    const store = tx.objectStore('pages');
    const key = index + 1;
    await store.delete(key);

    if (index === curr_page_index) {
      curr_page_index = 0;
      if (pages.length > 0) {
        selectPage(0);
      } else {
        title = "";
        note = "";
      }
    } else if (index < curr_page_index) {
      curr_page_index--;
    }

    // Update local storage after deletion
    const allPages = await getPages();
    pages = allPages;
  }

  onMount(async () => {
    await initDB();
    pages = await getPages();
    if (pages.length > 0) {
      title = pages[curr_page_index];
      const noteObj = await db.get('notes', title);
      note = noteObj ? noteObj.note : "";
    } else {
      await addPage();
    }
  });
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex items-center">
          <button
            on:click={() => selectPage(index)}
            class="{index == curr_page_index ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg"
          >
            {page}
          </button>

          <button
            on:click={() => deletePage(index)}
            class="ml-auto bg-gray-100 text-black px-5 py-2.5 rounded-lg font-medium text-sm mt-1 border border-gray-500 hover:bg-gray-500 hover:text-white"
          >
            DELETE PAGE
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
      class="ml-auto bg-gray-900 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-700"
      on:click={saveNote}
    >Save</button>
  </div>
  <input
    class="block w-full bg-grey-50 border border-grey-300 rounded-lg text-gray-900 p-2.5"
    bind:value={title}
    type="text"
    placeholder="Add title"
  />
  <textarea
    class="mt-3 block w-full bg-gray-300 rounded-lg text-gray-900 p-2.5"
    bind:value={note}
  ></textarea>
</main>

<style>
  .bg-light-gray {
    background-color: rgb(228, 235, 224);
  }
  .bg-dark-gray {
    background-color: azure;
  }
</style>
