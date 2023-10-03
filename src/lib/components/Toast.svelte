<script lang="ts">
  export let type: 'success' | 'warning' = 'success';
  export let icon: string | null = null;
  export let text: string = '';
  export let duration: number = 4;
</script>

<!-- ====================================================================== -->

<div class="alert flex flex-col items-start gap-2">
  <div class="flex flex-row gap-4">
    {#if icon}
      <i class="{icon} text-{type}"></i>
    {/if}
    <span>{text}</span>
  </div>

  <progress class="progress progress-{type}" value="70" max="100"></progress>
</div>
