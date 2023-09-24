<script lang="ts">
  import type { Realmlist } from '$lib/models';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let realmlist: Realmlist | null = null;
  export let isActive: boolean = false;

  let isCopied: boolean = false;

  const startCopyAnimation = () => {
    isCopied = true;
    setTimeout(() => {
      isCopied = false;
    }, 2000);
  };
</script>

<!-- ====================================================================== -->

<div class="group card bg-base-200 flex flex-row items-center gap-4 p-4">
  <div class="tooltip tooltip-right" data-tip="Set">
    <button class="btn group-hover:btn-primary" on:click={() => dispatch('setRealmlist', realmlist)}>
      <i class="bi bi-play text-xl"></i>
    </button>
  </div>

  <div>
    <div class="flex flex-row items-baseline gap-2 font-bold">
      <div class="text-primary">{realmlist?.server}</div>
      {#if isActive}
        <div class="badge badge-sm badge-success rounded font-mono uppercase">
          Active
        </div>
      {/if}
    </div>
    <div class="font-mono">{realmlist?.realmlist}</div>
  </div>

  <div class="flex flex-row ml-auto invisible group-hover:visible">
    <div class="tooltip tooltip-left" data-tip={isCopied ? 'Copied!' : 'Copy'}>
      <button class="btn" on:click={() => startCopyAnimation()}>
        {#if isCopied}
          <i class="bi bi-clipboard-check text-success"></i>
        {:else}
          <i class="bi bi-clipboard"></i>
        {/if}
      </button>
    </div>

    <div class="tooltip tooltip-left" data-tip="Edit">
      <button class="btn">
        <i class="bi bi-pencil"></i>
      </button>
    </div>

    <div class="tooltip tooltip-left" data-tip="Delete">
      <button class="btn hover:text-error">
        <i class="bi bi-trash3"></i>
      </button>
    </div>
  </div>
</div>
