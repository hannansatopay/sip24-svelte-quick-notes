<script lang="ts">
    import Back from "./Back.svelte";
    import Plus from "./Plus.svelte";
    import Settings from "./Settings.svelte";
    let edit: Boolean = false
    
</script>

<nav class="flex justify-between items-center p-8">
    <div class={`text-2xl font-semibold ${edit ? "hidden" : ""}`}>
        Quick Notes
    </div>
    <div class={`${edit ? "" : "hidden"}`}>
        <button on:click={()=> edit = false}>
            <Back/>
        </button>
    </div>
    <div class={`flex justify-center items-center gap-4 ${edit ? "hidden" : ""}`}>
        <button on:click={() => edit = true}>
            <Plus/>
        </button>
        <button>
            <Settings/>
        </button>
    </div>
    <div class={`text-blue-700 ${edit ? "" : "hidden"}`}>
        <button>
            Done
        </button>
    </div>
</nav>