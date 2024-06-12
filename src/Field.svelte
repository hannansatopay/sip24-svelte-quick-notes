<script lang="ts">
    let title = '';
    let description = '';
  </script>
  
  <div class="p-8 flex flex-col">
    <input bind:value={title} type="text" class="border-solid border-[#27272A] border-2 rounded-md p-2 w-full text-xl" placeholder="Title" />
    <textarea bind:value={description} name="description" id="description" rows="20" placeholder="Description" cols="30" class="border-solid border-[#27272A] border-2 rounded-md p-2 w-full mt-4"></textarea>
  </div>