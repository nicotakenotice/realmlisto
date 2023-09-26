<script lang="ts">
  import type { Realmlist } from '$lib/models';
  import { createEventDispatcher } from 'svelte';
  
  export let className: string = '';
  export let realmlist: Realmlist | null = null;
  export let isActive: boolean = false;
  
  const dispatch = createEventDispatcher();
  let isCopied: boolean = false;

  const copyRealmlist = () => {
    navigator.clipboard.writeText(realmlist?.realmlist!);
    isCopied = true;
    setTimeout(() => {
      isCopied = false;
    }, 2000);
  };
</script>

<!-- ====================================================================== -->

<div class="group card bg-base-200 flex flex-row items-center gap-4 p-4 overflow-hidden {className}">
  <div class="tooltip tooltip-right" data-tip="Set">
    <button class="btn group-hover:btn-primary" on:click={() => dispatch('setRealmlist', realmlist)}>
      <i class="bi bi-play text-xl"></i>
    </button>
  </div>

  <div class="flex-grow overflow-hidden">
    <div class="flex flex-row items-baseline gap-2 font-bold">
      <div class="text-primary">{realmlist?.server}</div>
      {#if isActive}
        <div class="badge badge-sm badge-success rounded font-mono uppercase">
          Active
        </div>
      {/if}
    </div>
    <div class="font-mono ellipsis">{realmlist?.realmlist}</div>
  </div>

  <div class="flex flex-row invisible group-hover:visible">
    <div class="tooltip tooltip-left" data-tip={isCopied ? 'Copied!' : 'Copy'}>
      <button class="btn" on:click={() => copyRealmlist()}>
        {#if isCopied}
          <i class="bi bi-clipboard-check text-success"></i>
        {:else}
          <i class="bi bi-clipboard"></i>
        {/if}
      </button>
    </div>

    <div class="tooltip tooltip-left" data-tip="Edit">
      <button class="btn" on:click={() => dispatch('editRealmlist', realmlist)}>
        <i class="bi bi-pencil"></i>
      </button>
    </div>

    <div class="tooltip tooltip-left" data-tip="Delete">
      <button class="btn hover:text-error" on:click={() => dispatch('deleteRealmlist', realmlist)}>
        <i class="bi bi-trash3"></i>
      </button>
    </div>
  </div>
</div>

<!-- ====================================================================== -->

<style>
  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
