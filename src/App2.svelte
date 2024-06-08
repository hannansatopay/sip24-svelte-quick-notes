<script>
    import {onMount} from 'svelte';
    let pages=[];
    let currentPageIndex=0
    let title ="";
    let note= "";
    
    
    onMount(()=>{
      const savedpages = localStorage.getItem("pages") 
      if(savedpages ){
        pages=JSON.parse(savedpages)
        title= pages[currentPageIndex] 
        note=localStorage.getItem(title)
        console.log(title)
      }
      else{
  
        addPage()
  
      }
      console.log("hii")
      // title = localStorage.getItem("title")  
      // note = localStorage.getItem("note") ;
    })
    
    function saveNote() {
      const storedPageName=pages[currentPageIndex]
      if( storedPageName!= title){
        localStorage.removeItem(storedPageName)
        pages[currentPageIndex]=title
        
      }
      
      localStorage.setItem(title,  note);
      localStorage.setItem("pages",  JSON.stringify(pages));
    
    }
  
    function addPage() {
      pages.push("New Page")
      // pages=pages
      selectPage(pages.length ? pages.length-1 :0)
    }
  
  
    function selectPage(index) {
      
      currentPageIndex=index
      console.log(title)
      title=pages[index] || "New Page"
      console.log(title)
      note=localStorage.getItem(title)
      
      
  
      
    }
    function rem(currentPageIndex) {
      console.log(currentPageIndex)
      const storedPageName=pages[currentPageIndex]
      console.log(storedPageName)
  
      const arrayWithoutD = pages.filter(function (letter) {
      return letter !== storedPageName;
  });
      console.log(arrayWithoutD)
      pages = arrayWithoutD;
      if (pages.length==0) {
        localStorage.removeItem("pages");  
      } else {
        localStorage.setItem("pages",  JSON.stringify(pages));
      }
  
     
      localStorage.removeItem(storedPageName)
      selectPage(pages.length ? pages.length-1 :0)
  
  
    //   localStorage.removeItem(storedPageName)
      
     }
  
  </script>
  
  <aside class="fixed top-0 left-0 z-40 w-60 h-screen">
    <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200 ">
      <ul class="space-y-2">
        {#each pages as page,index}
        <li> 
          <button class=" { index ==currentPageIndex ? 'bg-dark-gray' : '' }  py-2 px-3 text-gray-900 rounded-lg "  on:click={()=> selectPage(index)}>{ page}</button>
        </li>
        {/each}
        <li class="text-center">
          <button class="font-medium" on:click={addPage}> + Add page </button>
        </li>
      </ul>
    </div>
  </aside>
  <main class="p-4 ml-60 h-auto">
      <div class="grid grid-cols-2 item-center mb-3">
        <h1 class="text-3xl font-bold"  contenteditable="true" bind:textContent={title} ></h1>
        <button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={saveNote}>Save</button>
      </div>
      <hr>
      <textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea> 
      <button class="py-2 px-3 text-gray-900 rounded-lg bg-red-600 text-white mt-3" on:click={()=>{rem((currentPageIndex))}}>DELETE</button></main>
    
    
  </main>
  
  <style>
    .bg-light-gray{
      background: #fbfbff;
    }
    .bg-dark-gray{
      background: #efefef ;
    }
  </style>
    
  
  