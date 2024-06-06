<script>
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  const db = new Dexie('notesDatabase');
  db.version(1).stores({
    notes: 'title, content'
  });

  let pages = [];
  let currentPageIndex = 0;

  let title = '';
  let note = '';

  onMount(async () => {
    const savedPages = await db.notes.toArray();
    if (savedPages.length > 0) {
      pages = savedPages.map(page => page.title);
      title = pages[currentPageIndex];
      const storedNote = await db.notes.get({ title });
      note = storedNote ? storedNote.content : '';
    } else {
      addPage();
    }
  });

  async function saveNote() {
    const storedPageName = pages[currentPageIndex];
    if (storedPageName !== title) {
      await db.notes.delete(storedPageName);
      pages[currentPageIndex] = title;
    }
    await db.notes.put({ title, content: note });
  }

  async function addPage() {
    const newTitle = "New Page";
    pages.push(newTitle);
    await db.notes.put({ title: newTitle, content: '' });
    selectPage(pages.length - 1);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    title = pages[currentPageIndex];
    // @ts-ignore
    const storedNote = await db.notes.get({ title });
    note = storedNote ? storedNote.content : '';
  }

  async function deletePage(index) {
    const pageTitle = pages[index];
    await db.notes.delete(pageTitle);
    pages.splice(index, 1);
    if (index === currentPageIndex) {
      currentPageIndex = pages.length ? 0 : -1;
      if (currentPageIndex !== -1) {
        title = pages[currentPageIndex];
        const storedNote = await db.notes.get({ title });
        note = storedNote ? storedNote.content : '';
      } else {
        title = '';
        note = '';
      }
    } else if (index < currentPageIndex) {
      currentPageIndex--;
    }
    await db.notes.put({ title, content: note });
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li class="flex justify-between items-center">
          <button class="{index === currentPageIndex ? 'bg-dark-gray' : ''} bg-dark-gray py-2 px-3 text-gray-900 rounded-lg flex-1 text-left" on:click={() => selectPage(index)}>{page}</button>
          <button class="ml-2 text-red-500" on:click={() => deletePage(index)}>Delete</button>
        </li>
      {/each}
      <li class="text-center">
        <button class="font-medium" on:click={addPage}>+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
  </div>
  <hr>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }
  .bg-dark-gray {
    background: #efefef;
  }
</style>
