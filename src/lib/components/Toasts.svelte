<script lang="ts">
  import { toasts } from '$lib/store/toastsStore';
  import Toast from './Toast.svelte';
</script>

<!-- ====================================================================== -->

{#if $toasts}
  <div class="toast w-80">
    {#each $toasts as toast (toast.id)}
      <Toast {toast} />
    {/each}
  </div>  
{/if}
