<script>
    import { createEventDispatcher } from 'svelte';
    export let title = ''; // Title of the page to be deleted
    const dispatch = createEventDispatcher();

    function emitClose() {
        dispatch('cancel');
    }

    function emitConfirm() {
        dispatch('confirm');
    }
</script>

<div class="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white rounded-lg p-4 shadow-md">
        <h3 class="text-lg font-medium mb-3">Are you sure you want to delete "{title}"? !!</h3>
        <div class="flex justify-end space-x-2">
            <button class="bg-gray-400 text-black font-medium px-4 py-2 rounded-lg hover:bg-gray-300 border border-gray-800" on:click={emitClose}>Cancel</button>
            <button class="bg-gray-900 text-white font-medium px-4 py-2 rounded-lg hover:bg-gray-800 border border-gray-400" on:click={emitConfirm}>Confirm</button>
        </div>
    </div>
</div>

<style>
  .fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10; 
  }
  .bg-white {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  }
</style>
