<script>
  import {onMount} from "svelte"
  import {db} from "./db"

  
  // let pages = [];
  let currentPageIndex = 0;
  // let title="new note";
  // let note = "Today is an excellent day!";

  let notes
 




  onMount(async ()=>{
      // const savedPages = localStorage.getItem('pages')
      // if(savedPages){
      //   pages = JSON.parse(savedPages);
      //   title = pages[currentPageIndex]
      //   note = localStorage.getItem('title');
      // } else{
      //   addPage();
      // }

      // $s:notes = db.stickyNotes.toArray()

      // notes = [
      //   {title:'test1',note:'t1'}
      // ]

  /*
    database table stickyNots fetch with all table data. 
  */

  notes =  await db.stickyNotes.toArray()

   /*
    initialise first page when no data available in table
   */

  if(notes.length == 0){
    let noteObj = {title:"New Page",note:""}
    notes.push(noteObj)
  }
    

  })

  async function saveNote(){
    // const savedPageName = pages[currentPageIndex];
    // if(savedPageName != title){
    //   localStorage.removeItem(savedPageName)
    // pages[currentPageIndex] = title;

    // }
    // localStorage.setItem(title,note);
    // localStorage.setItem('pages',JSON.stringify(pages));


    /*
      selected page saved to data base if id key not available else update data in db 
    */

    if(!notes[currentPageIndex].hasOwnProperty("id")){
      db.stickyNotes.add({
      title:notes[currentPageIndex].title,
      note:notes[currentPageIndex].note
    });
    notes =  await db.stickyNotes.toArray()
    }else{
      db.stickyNotes.put({
      id:notes[currentPageIndex].id,
      title:notes[currentPageIndex].title,
      note:notes[currentPageIndex].note
    });
    notes =  await db.stickyNotes.toArray()
    }

     


  }

  async function removeNote(index){
    // let pageTitle = pages[index];
    // localStorage.removeItem(pageTitle);
    // pages.splice(index,1);
    // pages = pages;
    // localStorage.setItem("pages",JSON.stringify(pages))


    /*
      deleting table collection with selected id value ,if id value avilable
      else delete that value from notes array
    */

if(notes[index].hasOwnProperty("id")){
  var deleteCount = db.stickyNotes.where("id").anyOf(notes[index].id).delete();
  notes =  await db.stickyNotes.toArray();
}else{
  notes.splice(index,1)
  notes = notes;
}

/*
  initialises the notes array if array is empty
*/

if(notes.length == 0){
    let noteObj = {title:"New Page",note:""}
    notes.push(noteObj)
    notes = notes;
  }

  /*
    selecting current page index to last one
  */

    selectPage(notes.length ? notes.length-1 : 0)
    

  }

  function addPage(){
    // pages.push("new page")
    // pages=pages;

    /*
      when the add page button clicks new note object adds to array,
      more than page button clicks removes previous objects has no id and keep
      last object only.
    */

    let noteObj = {title:"New Page",note:""};
    
    notes.push(noteObj);
    notes.forEach((note,i) => {
      if(!note.hasOwnProperty("id") && i!=notes.length-1){
        notes.splice(i,1)
      }
    });
    notes = notes;
    // currentPageIndex += 1;
    // pages =pages

  /*
    selecting current page index to last one
  */
    
    selectPage(notes.length ? notes.length-1 : 0);
  }

  function selectPage(index){

  /*
    selecting current page index to last one
  */

    currentPageIndex = index;
    // title = pages[currentPageIndex];
    // note = localStorage.getItem(title);
  }
 
</script>
<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
<div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
  <ul class="space-y-2">
    {#if notes}

    {#each notes as note, index}
      <li>
          <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray':'bg-light-gray'} py-2 px-3 text-gray-900 rounded-lg" >{note.title} </button>
      </li>
    {/each}
    {/if}

    <li class="text-center">
      <button class="font-medium bg-light-violet px-3 py-2 rounded-lg" on:click={addPage}>+Add Page</button>
    </li>
  </ul>
</div>
</aside>
<main class="p-4 ml-60 h-auto">
  <div class="grid grid-cols-2 items-center mb-3">
    {#if notes}
    <h1 class="text-3xl font-bold" contenteditable bind:textContent={notes[currentPageIndex]['title']}></h1>
    {/if}
    <div>
      <button class="p-2 rounded-lg bg-red-600 text-white float-right hover:bg-red-700 mt-3" on:click={()=>removeNote(currentPageIndex)}>Delete</button>
      <button class="bg-gray-800 text-white px-5 py-2.5 rounded-lg mx-2 font-medium text-sm mt-3 hover:bg-gray-900 float-right" on:click={saveNote}>Save</button>
    </div>
  </div>
  
  <hr/>
  {#if notes}
  <textarea class="mt-3 block w-full bg-gray-100 border border-gray-400 rounded-lg text-gray-900 p-2.5" style="height: 200px;" bind:value={notes[currentPageIndex]["note"]} ></textarea>
  {/if}
</main>

<style>
.bg-light-gray{
  background: #FBFBBF;
}

.bg-dark-gray{
  background: #EFEFEF;
}

.bg-light-violet{
  background: #acbaf0;
}
</style>