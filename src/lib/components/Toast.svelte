<script lang="ts">
  import { TOAST_TYPE } from '$lib/models';

  export let type: TOAST_TYPE = TOAST_TYPE.SUCCESS;
  export let icon: string | null = null;
  export let text: string = '';
</script>

<!-- ====================================================================== -->

<div class="alert flex flex-col items-start gap-2">
  <div class="flex flex-row gap-4">
    {#if icon}
      <i 
        class="{icon}"
        class:text-success={type === TOAST_TYPE.SUCCESS}
        class:text-warning={type === TOAST_TYPE.WARNING}>
      </i>
    {/if}
    <span>{text}</span>
  </div>

  <progress 
    class="progress" 
    class:progress-success={type === TOAST_TYPE.SUCCESS}
    class:progress-warning={type === TOAST_TYPE.WARNING}
    value="70" 
    max="100">
  </progress>
</div>
