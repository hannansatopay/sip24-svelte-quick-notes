<script>
  import { onMount } from 'svelte';
  import { getNotes,getNotesFromTitle,saveNote,deleteNoteFromTitle } from './Database.js';

  let pages = [];
  let currentPageIndex = 0;
  let title = '';
  let note = '';

  onMount(async () => {
    pages = await getNotes();

    if (pages.length > 0) {      
      currentPageIndex = 0;
      title = pages[currentPageIndex].title;
      note = pages[currentPageIndex].note;
    } else {
      addPage();
    }
  });

  async function saveCurrentNote() {
    const storedPageName = pages[currentPageIndex].title;
    if (storedPageName != title) {
      await deleteNoteFromTitle(storedPageName);
      pages[currentPageIndex].title = title;
    }
    pages[currentPageIndex].note = note;
    await saveNote({
      title: title,
      note: note
    });
  }

  async function addPage() {
    pages.push({title: 'New Page', note: ''});
    selectPage(pages.length ? pages.length-1:0);
  }

  async function deletePage(index){
    if(index === 0){
      addPage();
    }
    const deletedPageTitle = pages[index].title;
    await deleteNoteFromTitle(deletedPageTitle);
    pages.splice(index,1);
    if(pages.length === 0){
      addPage();
    }else{
      if(index === currentPageIndex){
        currentPageIndex = Math.max(index-1,0);
      }
      selectPage(currentPageIndex);
    }
  }

  async function deleteCurrentPage(){
    await deletePage(currentPageIndex);
  }

  async function selectPage(index) {
    currentPageIndex = index;
    const selectedNote = pages[currentPageIndex];
    title = selectedNote.title;
    note = selectedNote.note;
  }
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
<div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200"> 
  <ul class="space-y-2">
    {#each pages as page, index}
    <li>
      <button on:click={()=>selectPage(index)} class="{index === currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-dark-900 bg-violate-900 rounded-lg hover:bg-violate-820">{page.title}</button>
    </li>
    {/each}
    <li class="text-center"><button on:click={addPage} class="bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-red-700">+ Add page</button></li>
  </ul>
</div>
</aside>

<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={title}></h1>
    <div class="ml-auto flex space-x-">
      <button class="ml-auto bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-blue-800" on:click={saveCurrentNote}>Save</button>
      <button class="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 ml-2 hover:bg-green-800" on:click={deleteCurrentPage}>Delete</button>
    </div>    
  </div>
  <hr/>
  <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
</main>

<style>
.bg-light-gray {
  background: #FBFBFB;
}
.bg-dark-gray {
  background: #EFEFEF;
}
</style>
