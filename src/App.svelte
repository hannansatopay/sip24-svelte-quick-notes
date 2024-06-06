<script>
  import { onMount } from 'svelte';
  import Dexie from 'dexie';
  const db = new Dexie("NotesDB");
  db.version(1).stores({
    pages: '++id,title,note'
  });
  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';
  onMount(async () => {
    pages = await db.pages.toArray();
    if (pages.length > 0) {
      selectPage(0);
    } else {
      await addPage();
    }
  });
  async function saveNote() {
    const currentPage = pages[currentPageIndex];
    if (currentPage.title !== title || currentPage.note !== note) {
      await db.pages.update(currentPage.id, { title, note });
      pages[currentPageIndex] = { id: currentPage.id, title, note };
    }
  }
  async function addPage() {
    const newPage = { title: 'New page', note: '' };
    const id = await db.pages.add(newPage);
    pages.push({ id, ...newPage });
    selectPage(pages.length - 1);
  }
  function selectPage(index) {
    currentPageIndex = index;
    const currentPage = pages[currentPageIndex];
    title = currentPage.title;
    note = currentPage.note;
  }
  async function deletePage() {
    const currentPage = pages[currentPageIndex];
    await db.pages.delete(currentPage.id);
    pages.splice(currentPageIndex, 1);
    if (pages.length === 0) {
      await addPage();
    } else {
      selectPage(currentPageIndex > 0 ? currentPageIndex - 1 : 0);
    }
  }
</script>


<aside class="fixed top-0 left-0 z-40 w-60 h-screen bg-light-gray border-r border-gray-200 py-5 px-3 overflow-y-auto">
  <ul class="space-y-2">
    {#each pages as page, index}
      <li>
        <button on:click={() => selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page.title}</button>
      </li>
    {/each}
    <li class="text-center">
      <button class="font-medium" on:click={addPage}>+ Add Page</button>
    </li>
  </ul>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex space-x-2">
      <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
      <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={deletePage}>Delete</button>
    </div>
  </div>
  <hr />
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  .bg-light-gray{
    background: #fbfbfb;
  }
  .bg-dark-gray{
    background: #efefef;
  }
</style>