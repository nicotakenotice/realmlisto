<script lang="ts">
  import RealmlistCard from '$lib/components/RealmlistCard.svelte';
  import { REALMLIST_SOURCE } from '$lib/enums';
  import { RealmlistFile, Realmlist } from '$lib/models';
  import { onMount } from 'svelte';

  const appName: string = 'realmlisto';
  let realmlistFile: RealmlistFile = new RealmlistFile();
  let realmlists: Realmlist[] = [];
  let selectedRealmlist: Realmlist = new Realmlist();
  let isSelectingFile: boolean = false;

  onMount(async () => {
    realmlistFile = await window.electronApi.getRealmlist$(REALMLIST_SOURCE.CONFIG);
    realmlists = await window.electronApi.getRealmlists$();
  });

  const getRealmlist$ = async () => {
    // Prevent opening multiple dialogs
    if (isSelectingFile) {
      return;
    }
    isSelectingFile = true;
    await window.electronApi.getRealmlist$(REALMLIST_SOURCE.DIALOG)
      .then((value) => {
        if (value.path) {
          realmlistFile = value;
        }
      })
      .finally(() => isSelectingFile = false);
  };

  const openModal = (id: string) => {
    selectedRealmlist = new Realmlist();
    const modal = document.getElementById(id);
    (modal as any)?.showModal();
  };

  const closeModal = (id: string) => {
    const modal = document.getElementById(id);
    (modal as any)?.close();
  };

  const saveRealmlist$ = async () => {
    console.log(selectedRealmlist);
    realmlists = await window.electronApi.saveRealmlists$([...realmlists, selectedRealmlist]);
    closeModal('modal-1');
  };
</script>

<!-- ====================================================================== -->

<header class="p-4">
  <h1 class="text-3xl font-bold">{appName}</h1>
</header>

<div class="flex flex-col gap-4 p-4">
  <div class="flex flex-row gap-4">
    <div class="tooltip tooltip-right" data-tip="Select realmlist">
      <button 
        class="btn btn-square btn-primary" 
        on:click={() => getRealmlist$()}
      >
        {#if isSelectingFile}
          <span class="loading loading-spinner loading-xs"></span>
        {:else}
          <i class="bi bi-folder"></i>
        {/if}
      </button>
    </div>

    <input
      class="input input-bordered font-mono w-full lg:w-1/2"
      type="text" 
      placeholder="Realmlist location"
      readonly 
      bind:value={realmlistFile.path}
    />
  </div>

  <div class="flex flex-row gap-4">
    <div class="tooltip tooltip-right" data-tip="Add new realmlist">
      <button 
        class="btn btn-square btn-primary" 
        on:click={() => openModal('modal-1')}
      >
        <i class="bi bi-plus-lg"></i>
      </button>
    </div>

    <textarea 
      class="textarea textarea-bordered font-mono resize-none w-full lg:w-1/2" 
      placeholder="Realmlist content"
      readonly
      bind:value={realmlistFile.content}
    />
  </div>
</div>

<div class="flex flex-col gap-4 p-4">
  <h3 class="text-lg font-bold">Entries ({realmlists.length})</h3>

  {#each realmlists as realmlist}
    <RealmlistCard 
      realmlist={realmlist} 
      isActive={realmlist.realmlist === realmlistFile.content} 
    />
  {/each}
</div>

<dialog id="modal-1" class="modal">
  <div class="modal-box">
    <div class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">New realmlist</h3>

      <form class="flex flex-col gap-4" on:submit|preventDefault={() => saveRealmlist$()}>
        <input
          class="input input-bordered valid:input-success font-mono"
          type="text" 
          placeholder="Server name" 
          autocomplete="off"
          required
          bind:value={selectedRealmlist.server}
        />

        <input
          class="input input-bordered valid:input-success font-mono"
          type="text" 
          placeholder="Realmlist"
          autocomplete="off"
          required
          bind:value={selectedRealmlist.realmlist}
        />

        <div class="flex flex-row justify-end gap-4">
          <button class="btn btn-success" type="submit">
            <i class="bi bi-save"></i>
            <span>Save</span>
          </button>
          
          <button 
            class="btn" 
            type="button" 
            on:click={() => closeModal('modal-1')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</dialog>
