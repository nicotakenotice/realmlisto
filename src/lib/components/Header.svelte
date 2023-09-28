<script lang="ts">
  import { THEME } from '$lib/enums';
  import type { RealmlistFile } from '$lib/models';
  import { createEventDispatcher, onMount } from 'svelte';

  const APP_NAME: string = 'realmlisto';
  const GITHUB_LINK: string = 'https://github.com/nicotakenotice/realmlisto';

  export let realmlistFile: RealmlistFile | null = null;

  let rootElement: HTMLElement | null = null;
  let darkTheme: boolean = true;

  const dispatch = createEventDispatcher();

  onMount(() => {
    rootElement = document.documentElement;
  });

  $: if (rootElement) {
    rootElement.dataset['theme'] = darkTheme ? THEME.DARK : THEME.LIGHT;
  }
</script>

<!-- ====================================================================== -->

<header class="flex flex-row items-center gap-4 p-4">
  <h1 class="flex-grow font-bold text-3xl">{APP_NAME}</h1>

  <div class="flex flex-row items-center">
    <div class="tooltip tooltip-left" data-tip={darkTheme ? 'Light mode' : 'Dark mode'}>
      <label class="btn btn-ghost swap swap-rotate text-lg">
        <input type="checkbox" bind:checked={darkTheme} />
        <i class="bi bi-moon swap-off" />
        <i class="bi bi-sun swap-on" />
      </label>
    </div>

    <div class="tooltip tooltip-left" data-tip="GitHub">
      <a class="btn btn-ghost text-lg" href={GITHUB_LINK} target="_blank">
        <i class="bi bi-github"></i>
      </a>
    </div>
  </div>

  <button 
    class="btn btn-outline btn-success" 
    class:btn-disabled={!realmlistFile?.path}
    on:click={() => dispatch('startClient')}
  >
    <i class="bi bi-play text-xl"></i>
    <span>Play</span>
  </button>
</header>
