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
  let isLoading: boolean = false;

  onMount(async () => {
    initKeybinds();
    realmlistFile = await window.electronApi.getRealmlist$(REALMLIST_SOURCE.CONFIG);
    realmlists = await window.electronApi.getRealmlists$();
  });

  const initKeybinds = () => {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case '+':
          e.preventDefault();
          editRealmlist$(new Realmlist());
          break;
        default:
          break;
      }
    });
  };

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
    const modal = document.getElementById(id);
    (modal as any)?.showModal();
  };

  const closeModal = (id: string) => {
    const modal = document.getElementById(id);
    (modal as any)?.close();
  };

  const saveRealmlist$ = async (realmlist: Realmlist) => {
    const isNew = realmlists.findIndex((o) => o.uuid === realmlist.uuid) === -1;
    const newRealmlists = isNew
      ? [...realmlists, realmlist]
      : realmlists.map((o) => o.uuid === realmlist.uuid ? realmlist : o);
    realmlists = await window.electronApi.saveRealmlists$(newRealmlists);
    closeModal('modal-1');
  };

  const setRealmlist$ = async (realmlist: Realmlist) => {
    await window.electronApi.setRealmlist$(realmlist)
      .then((value) => realmlistFile = value)
      .catch((error) => console.log(error));
  }

  const editRealmlist$ = async (realmlist: Realmlist) => {
    selectedRealmlist = realmlist;
    openModal('modal-1');
  }
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
      class="input input-bordered font-mono w-full"
      type="text" 
      placeholder="Realmlist location"
      readonly 
      bind:value={realmlistFile.path}
    />
  </div>

  <div class="flex flex-row gap-4">
    <div class="tooltip tooltip-right" data-tip="New realmlist">
      <button 
        class="btn btn-square btn-primary" 
        on:click={() => editRealmlist$(new Realmlist())}
      >
        <i class="bi bi-plus-lg"></i>
      </button>
    </div>

    <textarea 
      class="textarea textarea-bordered font-mono resize-none w-full" 
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
      on:setRealmlist={(e) => setRealmlist$(e.detail)}
      on:editRealmlist={(e) => editRealmlist$(e.detail)}
    />
  {/each}
</div>

<dialog id="modal-1" class="modal">
  <div class="modal-box">
    <div class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">
        {selectedRealmlist.server ? 'Edit' : 'New' } realmlist
      </h3>

      <form class="flex flex-col gap-4" on:submit|preventDefault={() => saveRealmlist$(selectedRealmlist)}>
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
