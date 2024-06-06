<script>
  import {onMount} from "svelte"

  let Pages=[];
  let CurrentPageIndex=0;

 let title=" ";
 let note=" "

 onMount(()=>{
  const SavedPages=localStorage.getItem("Pages")
  if (SavedPages){
    Pages=JSON.parse(SavedPages)
    title=Pages[CurrentPageIndex] || "New Pages"
    note = localStorage.getItem(title)
  }
  else{
    AddPage();
  }
 })
 
function Save_Note(){
  const StoredPageName= Pages[CurrentPageIndex];
  if (StoredPageName!=title){
    localStorage.removeItem(StoredPageName);
    Pages[CurrentPageIndex]=title;
  }
  
  localStorage.setItem(title,note)
  localStorage.setItem("Pages",JSON.stringify(Pages))
}



function AddPage(index){
  Pages.push("newPage")
  SelectPage(Pages.length?Pages.length-1:0)
}

function SelectPage(index){
  CurrentPageIndex=index;
  title=Pages[CurrentPageIndex];
  note =localStorage.getItem(title)
}
</script>

<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
  <div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-200">
    <ul class="space-y-2">
      {#each Pages as Page, index}
      <li>
        <button on:click={()=>SelectPage(index)} class=" {index==CurrentPageIndex? "bg-dark-gra":""} bg-dark-gray py-2  px-3 text-gray-900 rounded-lg">{Page}</button>
      </li>
      {/each}
      <li class="text-center"><button on:click={AddPage} class="font-bold">+Add Page</button></li>
    </ul>
  </div>
</aside>


<main class="p-4 ml-60 h-auto">
   <div class="grid grid-cols-2 text-center mb-3">
    <h1 class="text-3xl font-blod-900 " contenteditable bind:textContent={title}></h1>
   <button class="bg-gray-800 ml-auto w-12 text-white py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900 " on:click={Save_Note}>Save</button>
   </div>
   <hr/>
  <textarea class="block w-full mt-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5" name="" id="" bind:value={note}></textarea>
</main>


<style>
.bg-light-gray {
  background:#FBFBFB;
}
.bg-dark-gray{
  background: #EFEFEF;
}
</style>