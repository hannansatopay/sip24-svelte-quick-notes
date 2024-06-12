<script lang="ts">
    export let date: string|null;
    export let title: string|null;
    export let words: string|null;
</script>

<div class="flex flex-col justify-center bg-slate-100 rounded-lg gap-2 p-8 px-6">
    <div class="text-xs font-thin">
        Date: {date}
    </div>
    <div class="text-xl font-bold">
        {title}
    </div>
    <div class="text-xs font-thin">
        Words: {words}
    </div>
</div>