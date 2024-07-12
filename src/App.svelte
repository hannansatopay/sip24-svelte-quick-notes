<script lang="ts">
  import { onMount } from 'svelte';
  import Dexie from 'dexie';

  interface Note {
    id?: number;
    title: string;
    note: string;
  }

  const db = new Dexie('notes_database');
  db.version(1).stores({
    notes: '++id, title, note',
  });

  let pages: string[] = [];
  let pageindex: number = 0;
  let title: string = 'Title';
  let note: string = 'Make notes';

  onMount(async () => {
    try {
      const savedPages: Note[] = await db.table('notes').toArray();
      if (savedPages.length > 0) {
        pages = savedPages.map(page => page.title);
        title = pages[pageindex];
        const selectedNote = await db.table('notes').get({ title: title });
        if (selectedNote) {
          note = selectedNote.note;
        }
      } else {
        await addPage();
      }
    } catch (error) {
      console.error('Error loading pages from IndexedDB:', error);
    }
  });

  async function save() {
  const pageName = pages[pageindex];
  if (pageName !== title) {
    await db.table('notes').update(pageName, { title: title, note: note });
  }
  await db.table('notes').put({ title: title, note: note });
  const savedPages: Note[] = await db.table('notes').toArray();
  pages = savedPages.map(page => page.title);
}

  async function addPage() {
    const newPage: Note = { title: 'New Page', note: 'New notes' };
    const id = await db.table('notes').add(newPage);
    pages.push(newPage.title); 
    selectPage(pages.length - 1); 
  }

  async function deletePage(index: number) {
  const pageTitle = pages[index];
  const noteToDelete = await db.table('notes').get({ title: pageTitle });
  if (noteToDelete) {
    await db.table('notes').delete(noteToDelete.id);
    pages.splice(index, 1); 
    if (index === pageindex) {
      if (index === pages.length) {
        pageindex--; 
      }
      selectPage(pageindex); 
    }
  }
}

  function selectPage(index: number) {
    pageindex = index;
    title = pages[pageindex];
    db.table('notes').get({ title: title }).then((result: Note | undefined) => {
      if (result) {
        note = result.note;
      }
    });
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen ">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each pages as page, index}
        <li>
          <button on:click={()=>selectPage(index)} class="{index === pageindex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg  ">{page}</button>
          <button on:click={()=>deletePage(index)} class="ml-2 text-red-600 hover:text-red-900">X</button>
        </li>
      {/each}
      <li class="text-center"><button class="font-medium" on:click={addPage}>+ Add Page</button></li>
    </ul>
  </div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <button class="ml-auto mt-3 bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-900" on:click={save}>Save</button>
  </div>
  <hr>
  <input class="block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note} type="text"> 
</main>

<style>
  .bg-light-gray {
    background: #fbfbfb;
  }
  .bg-dark-gray {
    background: #efefef;
  }
</style>