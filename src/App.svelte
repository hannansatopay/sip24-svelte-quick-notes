<script>
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  let db;
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    db = new Dexie('notes');
    db.version(1).stores({
      pages: '++id, title',
      notes: 'title, note'
    });

    pages = await db.pages.toArray();

    if (pages.length) {
      await selectPage(currentPageIndex);
    } else {
      await addPage();
    }
  });

  async function saveNote() {
    const storedTitle = pages[currentPageIndex].title;
    if (storedTitle != title) {
      await db.notes.delete(storedTitle);
      pages[currentPageIndex].title = title;
      await db.pages.put({ id: pages[currentPageIndex].id, title });
    }
    await db.notes.put({ title, note });
    pages = await db.pages.toArray();
  }

  async function addPage() {
    await db.pages.add({ title: 'New Page' });
    pages = await db.pages.toArray();
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    const selectedPage = await db.pages.get(pages[currentPageIndex].id);
    title = selectedPage.title;
    const savedNote = await db.notes.get(title);
    note = savedNote ? savedNote.note : '';
  }

  async function deleteNote() {
    const pageToDelete = pages[currentPageIndex].title;
    await db.notes.delete(pageToDelete);
    await db.pages.delete(pages[currentPageIndex].id);
    pages.splice(currentPageIndex, 1);
    if (pages.length > 0) {
      await selectPage(pages.length - 1);
    } else {
      title = '';
      note = '';
      await addPage();
    }
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <textarea class="block w-full h-12 bg-teal-500 border border-gray-300 text-white text-3xl font-bold py-1 px-9 overflow-hidden resize-none">NoteNest</textarea>
  <hr/>
  <div class="bg-gray-200 overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
      <li>
          <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-teal-300 border-teal-500' : 'bg-gray-200'} py-2 px-3 text-gray-900 rounded-lg hover:bg-teal-400">{page.title}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
    </ul>
  </div>
</aside>

<main class=" p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-2xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr/>
  <div class="mr-4">
  <textarea class="mt-5 ml-1 block w-full h-60 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note} placeholder="Write..."></textarea>
  </div>
  <div class="text-center">
  <button class= "bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-base mt-5 hover:bg-red-800" on:click = {deleteNote}>Delete</button>
  </div>
</main>

<style>
.bg-light-gray {
  background: #FBFBFB;
}

.bg-dark-gray {
  background: #EFEFEF;
}
</style>
