<script lang="ts">
  import { base } from '$app/paths';
  import { theme } from '$lib/stores/theme.svelte';
  
</script>

<header class="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-20 lg:px-40 py-6 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-50">
  <div class="flex items-center gap-3">
    <div class="size-6 text-primary">
      <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path clip-rule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill-rule="evenodd"></path>
      </svg>
    </div>
    <h2 class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">Nguyen Van Hai</h2>
  </div>
  <div class="flex flex-1 justify-end gap-8">
    <nav class="hidden md:flex items-center gap-9">
      <a class="text-sm font-medium hover:text-primary transition-colors" href="{base}/">Home</a>
      <a class="text-sm font-medium hover:text-primary transition-colors" href="{base}/about">About</a>
      <a class="text-sm font-medium hover:text-primary transition-colors" href="{base}/blog">Blog</a>
      <a class="text-sm font-medium hover:text-primary transition-colors" href="{base}/cv">CV</a>
      <a class="text-sm font-medium hover:text-primary transition-colors" href="{base}/projects">Projects</a>
    </nav>
    <div class="flex gap-3">
      <button 
        onclick={() => theme.toggle()}
        class="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary hover:text-white transition-all" 
        aria-label="Toggle Theme"
      >
        <span class="material-symbols-outlined text-[20px]">
          {theme.current === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
      <button class="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-primary hover:text-white transition-all" aria-label="Share">
        <span class="material-symbols-outlined text-[20px]">share</span>
      </button>
    </div>
  </div>
</header>
