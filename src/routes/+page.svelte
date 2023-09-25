<script lang="ts">
  import RealmlistCard from '$lib/components/RealmlistCard.svelte';
  import { REALMLIST_SOURCE } from '$lib/enums';
  import { RealmlistFile, Realmlist } from '$lib/models';
  import { onMount } from 'svelte';

  const APP_NAME: string = 'realmlisto';
  const EDIT_MODAL_ID: string = 'edit-modal';
  const DELETE_MODAL_ID: string = 'delete-modal';
  
  let realmlistFile: RealmlistFile = new RealmlistFile();
  let realmlists: Realmlist[] = [];
  let selectedRealmlist: Realmlist = new Realmlist();
  let isSelectingFile: boolean = false;

  onMount(async () => {
    initKeybinds();
    realmlistFile = await window.electronApi.getRealmlist$(REALMLIST_SOURCE.CONFIG);
    realmlists = await window.electronApi.getRealmlists$();
  });

  const initKeybinds = () => {
    document.addEventListener('keydown', async (e) => {
      if (e.ctrlKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        editRealmlist(new Realmlist());
      }
      if (e.ctrlKey && (e.key === 'o' || e.key === 'O')) {
        e.preventDefault();
        await getRealmlist$();
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
    if (isNew) realmlist.uuid = crypto.randomUUID();
    const newRealmlists = isNew
      ? [...realmlists, realmlist]
      : realmlists.map((o) => o.uuid === realmlist.uuid ? realmlist : o);
    realmlists = await window.electronApi.saveRealmlists$(newRealmlists);
    closeModal(EDIT_MODAL_ID);
  };

  const setRealmlist$ = async (realmlist: Realmlist) => {
    await window.electronApi.setRealmlist$(realmlist)
      .then((value) => realmlistFile = value)
      .catch((error) => console.log(error));
  }

  const editRealmlist = (realmlist: Realmlist) => {
    selectedRealmlist = realmlist;
    openModal(EDIT_MODAL_ID);
  }

  const deleteRealmlist = (realmlist: Realmlist) => {
    selectedRealmlist = realmlist;
    openModal(DELETE_MODAL_ID);
  }

  const deleteForReal$ = async (realmlist: Realmlist) => {
    const newRealmlists = realmlists.filter((o) => o.uuid !== realmlist.uuid);
    realmlists = await window.electronApi.saveRealmlists$(newRealmlists);
    closeModal(DELETE_MODAL_ID);
  };
</script>

<!-- ====================================================================== -->

<header class="p-4">
  <h1 class="text-3xl font-bold">{APP_NAME}</h1>
</header>

<div class="flex flex-col gap-4 p-4">
  <div class="flex flex-row gap-4">
    <div class="tooltip tooltip-right" data-tip="Select realmlist (CTRL + O)">
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
    <div class="tooltip tooltip-right" data-tip="New realmlist (CTRL + A)">
      <button 
        class="btn btn-square btn-primary" 
        on:click={() => editRealmlist(new Realmlist())}
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
      on:editRealmlist={(e) => editRealmlist(e.detail)}
      on:deleteRealmlist={(e) => deleteRealmlist(e.detail)}
    />
  {/each}
</div>

<dialog id={EDIT_MODAL_ID} class="modal">
  <div class="modal-box">
    <div class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">
        {selectedRealmlist.uuid ? 'Edit' : 'New' } realmlist
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
            on:click={() => closeModal(EDIT_MODAL_ID)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</dialog>

<dialog id={DELETE_MODAL_ID} class="modal">
  <div class="modal-box">
    <div class="flex flex-col gap-4">
      <h3 class="text-lg font-bold">
        Delete realmlist
      </h3>

      <div>
        Are you sure you want to delete <span class="text-error font-bold">{selectedRealmlist.server}</span>?
      </div>

      <div class="flex flex-row justify-end gap-4">
        <button class="btn btn-error" on:click={() => deleteForReal$(selectedRealmlist)}>
          Yes
        </button>
        
        <button 
          class="btn" 
          type="button" 
          on:click={() => closeModal(DELETE_MODAL_ID)}
        >
          No
        </button>
      </div>
    </div>
  </div>
</dialog>
