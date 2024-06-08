<script>
import{onMount} from 'svelte';
let pages=[];
let currentPageIndex=0;
let topic='';
let note='';

onMount(() => {
const savedPages= localStorage.getItem("pages");
if(savedPages){
pages= JSON.parse(savedPages);
topic= pages[currentPageIndex] ;
note= localStorage.getItem(topic);
}
else{
addPage();
}
});

function savedNote(){
    const storedPageName = pages[currentPageIndex];
if (storedPageName!= topic) {
    localStorage.removeItem(storedPageName);
    pages[currentPageIndex]=topic;
}
localStorage.setItem(topic,note);
localStorage.setItem("pages" ,JSON.stringify(pages));
}

function deletePage() {
        const pageToDelete = pages[currentPageIndex];
        pages.splice(currentPageIndex, 1);
        localStorage.removeItem(pageToDelete);
        localStorage.setItem("pages", JSON.stringify(pages));
        if (pages.length === 0) {
            addPage();
        } else {
            selectPage(0); 
        }
    }
function addPage(){
pages.push("New Page");
selectPage(pages.length ? pages.length -1 : 0);
}
function selectPage(index) {
    currentPageIndex= index;
    topic=pages[currentPageIndex];
    note =localStorage.getItem(topic);
}



</script>
<aside class="fixed top-0 left-0 z-40 w-60 h-screen">
<div class="bg-light-gray overflow-y-auto py-5 px-3 h-full border-r border-gray-300">
<ul class="space-y-2">
{#each pages as page, index}
<li>
    <button on:click={()=>selectPage(index)} class="{index == currentPageIndex ? 'bg-dark-gray' : ''} py-2 px-3 text-gray-900 rounded-lg">{page}</button>
</li>

{/each}
<li class="text-center"><button on:click={addPage} class="font-medium">+ Add page</button></li>
</ul>
</div>

</aside>
<main class="p-4 ml-60 h-auto">
    <div class="grid grid-cols-2 items-center mb-3">
        <h1 class="text-3xl font-bold"contenteditable bind:textContent={topic}></h1>
        
    </div>
<hr/>

<textarea class="mt-3 block w-full bg-gray-50 border border-gray-300 rounded-lg text-gray-900 p-2.5" bind:value={note}></textarea>
<button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={savedNote}>SAVE</button>
<button class="ml-auto bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm mt-3 hover:bg-gray-900" on:click={deletePage}>DELETE</button>
</main>

<style>
.bg-light-gray{
background-color: burlywood;
}
.bg-dark-gray{
    background-color: beige;
}
.ml-auto{
justify-content: center;
}

</style>