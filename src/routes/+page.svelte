<script lang="ts">
  import { Realmlist } from '$lib/models';

  const appName: string = 'realmlisto';
  let realmlist: Realmlist = new Realmlist();
  let isSelectingFile: boolean = false;

  const getRealmlist$ = async () => {
    // Prevent opening multiple dialogs
    if (isSelectingFile) {
      return;
    }
    isSelectingFile = true;
    await window.electronApi.getRealmlist$()
      .then((value) => {
        if (value.path) {
          realmlist = value;
        }
      })
      .finally(() => isSelectingFile = false);
  };

  const openRealmlistModal = () => {
    const modal = document.getElementById('my_modal_1');
    (modal as any)?.showModal();
  };
</script>

<!-- ====================================================================== -->

<header class="p-4">
  <h1 class="text-3xl">{appName}</h1>
</header>

<div class="flex flex-col gap-4 p-4">
  <div class="flex flex-row gap-4">
    <div class="tooltip tooltip-right" data-tip="Select realmlist">
      <button 
        class="btn btn-square btn-primary no-animation" 
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
      bind:value={realmlist.path}
    />
  </div>

  <div class="flex flex-row gap-4">
    <div class="tooltip tooltip-right" data-tip="Add new realmlist">
      <button 
        class="btn btn-square btn-primary no-animation" 
        on:click={() => openRealmlistModal()}
      >
        <i class="bi bi-plus-lg"></i>
      </button>
    </div>

    <textarea 
      class="textarea textarea-bordered font-mono resize-none w-full lg:w-1/2" 
      placeholder="Realmlist content"
      readonly
      bind:value={realmlist.content}
    />
  </div>
</div>

<dialog id="my_modal_1" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Hello!</h3>
    <p class="py-4">Press ESC key or click the button below to close</p>
    <div class="modal-action">
      <form method="dialog">
        <!-- If there is a button in form, it will close the modal -->
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>
