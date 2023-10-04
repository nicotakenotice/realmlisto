<script lang="ts">
  import { TOAST_TYPE, Toast } from '$lib/models';
  import { onDestroy } from 'svelte';

  const MAX_PROGRESS_VALUE: number = 100;
  const INTERVAL_VALUE: number = 20;

  export let toast: Toast = new Toast();

  let progressValue: number = 100; // Progress goes from 100 to 0
  let intervalId = setInterval(updateProgressValue, INTERVAL_VALUE, MAX_PROGRESS_VALUE / (toast.duration / INTERVAL_VALUE));

  onDestroy(() => clearInterval(intervalId));

  function updateProgressValue(delta: number): void {
    progressValue -= delta;
  }
</script>

<!-- ====================================================================== -->

<div class="alert flex flex-col items-start gap-2">
  <div class="flex flex-row gap-4">
    {#if toast.icon}
      <i 
        class="{toast.icon}"
        class:text-info={toast.type === TOAST_TYPE.INFO}
        class:text-success={toast.type === TOAST_TYPE.SUCCESS}
        class:text-warning={toast.type === TOAST_TYPE.WARNING}>
      </i>
    {/if}
    <span>{toast.text}</span>
  </div>

  <progress 
    class="progress" 
    class:progress-info={toast.type === TOAST_TYPE.INFO}
    class:progress-success={toast.type === TOAST_TYPE.SUCCESS}
    class:progress-warning={toast.type === TOAST_TYPE.WARNING}
    value={progressValue} 
    max={MAX_PROGRESS_VALUE}>
  </progress>
</div>
