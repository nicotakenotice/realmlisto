<script lang="ts">
  import { Realmlist } from '$lib/models';

  const appName: string = 'realmlisto';
  let realmlist: Realmlist = new Realmlist();

  const getRealmlist$ = async () => {
    await window.electronApi.getRealmlist$()
      .then((value) => {
        if (value.path) {
          realmlist = value;
        }
      });
  };
</script>

<!-- ====================================================================== -->

<header class="p-4">
  <h1 class="text-3xl text-ellipsis">{appName}</h1>
</header>

<div class="flex flex-col flex-grow gap-4 p-4">
  <div class="flex flex-row gap-4">
    <input
      class="input input-bordered font-mono w-full lg:w-1/2"
      type="text" 
      placeholder="Realmlist location" 
      readonly 
      bind:value={realmlist.path}
    />

    <button 
      class="btn btn-primary no-animation" 
      on:click={getRealmlist$}
    >
      <i class="bi bi-folder"></i>
    </button>
  </div>

  <div>
    <textarea 
      class="textarea textarea-bordered font-mono resize-none w-full lg:w-1/2" 
      placeholder="Realmlist content"
      readonly
      bind:value={realmlist.content}
    />
  </div>
</div>
