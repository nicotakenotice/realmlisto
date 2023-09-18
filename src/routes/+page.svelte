<script lang="ts">
  const appName: string = 'realmlisto';
</script>

<!-- ====================================================================== -->

<header class="p-4">
  <h1 class="text-3xl">{appName}</h1>
</header>

<div class="flex flex-col flex-grow p-4">
  <div class="flex flex-row gap-4">
    <button class="btn btn-primary no-animation">
      <i class="bi bi-folder"></i>
    </button>

    <input 
      type="text" 
      class="input input-bordered font-mono"
      placeholder="Realmlist location" 
      readonly 
    />
  </div>
</div>
