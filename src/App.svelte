<script lang="ts">
  import { onMount } from "svelte";
  import Dexie from 'dexie';
  import type { Table } from 'dexie';

  interface Note {
    id?: number;
    title: string;
    content: string;
  }

  let dtbs: Dexie;
  let notesTable: Table<Note, number>;
  let pages: Note[] = [];
  let currentPageIndex = 0;
  let title = "";
  let note = "";

  onMount(async () => {
    dtbs = new Dexie("StickyNotesDatabase");
    dtbs.version(1).stores({
      notes: '++id, title, content'
    });
    notesTable = dtbs.table('notes');
    await loadNotes();
  });

  async function loadNotes() {
    pages = await notesTable.toArray();
    if (pages.length) {
      selectPage(0);
    } else {
      await addPage();
    }
  }

  async function saveNote() {
    const storedPage = pages[currentPageIndex];
    storedPage.title = title;
    storedPage.content = note;
    if (storedPage.id) {
      await notesTable.put(storedPage);
    }
    await loadNotes();
  }

  async function addPage() {
    const newPage: Note = { title: "New Page", content: "" };
    const id = await notesTable.add(newPage);
    newPage.id = id;
    pages.push(newPage);
    selectPage(pages.length - 1);
  }

  async function deletePage() {
    if (confirm("Do you want to delete this page?")) {
      const storedPage = pages[currentPageIndex];
      if (storedPage.id) {
        await notesTable.delete(storedPage.id);
        pages.splice(currentPageIndex, 1);
        if (pages.length) {
          selectPage(Math.max(0, currentPageIndex - 1));
        } else {
          await addPage();
        }
      }
    }
  }

  function selectPage(index: number) {
    currentPageIndex = index;
    title = pages[currentPageIndex].title;
    note = pages[currentPageIndex].content;
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button
            on:click={() => selectPage(index)}
            class="{index === currentPageIndex ? 'bg-dark-gray' : 'fade-white'} py-2 px-3 rounded-lg">{page.title}</button>
        </li>
      {/each}
      <li class="text-center">
        <button on:click={addPage} class="font-medium text-white m-5">+ Add Page</button>
      </li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold text-white" contenteditable bind:innerHTML={title}></h1>
    <div class="ml-auto flex">
      <button class="bg-sky-500 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 mr-3 hover:bg-sky-600" on:click={saveNote}>Save</button>
      <button class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700" on:click={deletePage}>Delete</button>
    </div>
  </div>
  <hr />
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
  :global(body) {
    background-color: #e1e1eb;
    margin: 0;
    font-family: Arial, sans-serif;
  }
  .bg-light-gray {
    background: #272727;
  }
  .bg-dark-gray {
    background: #efefef;
  }
  .text-white {
    color: #fff;
  }
  .fade-white {
    background-color: hsla(0, 10%, 94%, 0.61);
    color: #ffffffe1;
  }
</style>
