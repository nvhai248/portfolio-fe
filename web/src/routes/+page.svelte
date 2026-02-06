<script lang="ts">
    import type { PageData } from './$types';
    import { urlFor } from '$lib/sanity';

    let { data }: { data: PageData } = $props();

    // Helper to get social icon name based on platform
    function getSocialIcon(platform: string) {
        switch (platform.toLowerCase()) {
            case 'github': return 'code';
            case 'linkedin': return 'work';
            case 'twitter': return 'chat';
            default: return 'link';
        }
    }
</script>

<section class="px-6 md:px-20 lg:px-40 py-20 lg:py-32 flex flex-col max-w-[1200px] mx-auto">
    <h1 class="text-slate-900 dark:text-white tracking-tight text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-8">
        Hi, I’m Nguyen Van Hai. I am a Backend Engineer passionate about <span class="text-primary">System Architecture</span> and AI Integration.
    </h1>
    <!-- ActionsBar / Socials -->
    <div class="flex flex-wrap items-center gap-6 mt-4">
        {#if data.settings?.socials}
            {#each data.settings.socials as social}
                <a class="group flex items-center gap-3" href={social.url} target="_blank">
                    <div class="rounded-full bg-slate-200 dark:bg-slate-800 p-3 group-hover:bg-primary transition-colors">
                        <span class="material-symbols-outlined text-slate-900 dark:text-white group-hover:text-white" style="font-variation-settings: 'wght' 400">
                            {getSocialIcon(social.platform)}
                        </span>
                    </div>
                    <p class="text-sm font-semibold tracking-wide uppercase">{social.platform}</p>
                </a>
            {/each}
        {/if}
    </div>
</section>

<!-- Recent Insights Section Header -->
<section class="px-6 md:px-20 lg:px-40 max-w-[1200px] mx-auto">
    <div class="border-t border-slate-200 dark:border-slate-800 pt-16">
        <h2 class="text-slate-900 dark:text-white text-2xl font-bold tracking-tight mb-8">Recent Insights</h2>
    </div>
</section>

<!-- Blog Grid (Editorial Text-heavy) -->
<section class="px-6 md:px-20 lg:px-40 pb-24 max-w-[1200px] mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        {#if data.posts && data.posts.length > 0}
            {#each data.posts as post}
                <a href={post.slug?.current ? `/blog/${post.slug.current}` : '#'} class="flex flex-col gap-5 group cursor-pointer">
                    {#if post.mainImage}
                        <div class="w-full bg-slate-200 dark:bg-slate-800 aspect-video rounded-xl overflow-hidden relative">
                            <img 
                                src={urlFor(post.mainImage).width(800).height(450).url()} 
                                alt={post.mainImage.alt || post.title}
                                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        </div>
                    {:else}
                         <!-- Fallback gradient if no image -->
                         <div class="w-full bg-slate-200 dark:bg-slate-800 aspect-video rounded-xl overflow-hidden relative" style="background-image: linear-gradient(135deg, #1173d4 0%, #101922 100%);">
                            <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        </div>
                    {/if}
                    <div class="flex flex-col gap-2">
                        {#if post.categories && post.categories.length > 0}
                             <span class="text-xs font-bold text-primary tracking-widest uppercase">{post.categories[0]}</span>
                        {/if}
                        <h3 class="text-slate-900 dark:text-white text-xl font-bold leading-snug group-hover:underline decoration-primary underline-offset-4">{post.title}</h3>
                        {#if post.body && post.body[0] && post.body[0].children && post.body[0].children[0]}
                            <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                                {post.body[0].children[0].text}
                            </p>
                        {/if}
                        <span class="text-xs text-slate-400 mt-2">
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                </a>
            {/each}
        {:else}
            <!-- Fallback loading or empty state -->
             <p class="text-slate-500 dark:text-slate-400">Loading insights or no posts available...</p>
        {/if}
    </div>
</section>
