### Phase 1: Foundation and homepage direction

1. Keep the current editorial structure and messaging on `/en`, especially the strong headline, supporting copy, and CTA pattern. The 3D scene should support this content, not replace it. ([Nguyen Van Hai Portfolio][1])
2. Confirm SvelteKit app structure and isolate homepage logic into reusable sections:

   * `Hero`
   * `QuickProfile`
   * `RecentInsights`
   * `OpportunityCTA`
3. Add a homepage-specific animation architecture so the 3D hero can be loaded progressively and disabled on weaker devices.
4. Preserve existing performance, accessibility, and clarity goals from the original phased plan. ([Nguyen Van Hai Portfolio][1]) 

### Phase 2: 3D hero concept and rendering setup

1. Create a **3D Hero System** for the homepage.
2. Use a Svelte-friendly WebGL layer, ideally one of these paths:

   * **Three.js with a lightweight Svelte wrapper**
   * **Threlte** if you want a more native Svelte experience
3. Define the visual concept for the hero:

   * abstract system architecture nodes
   * flowing network lines
   * floating grid or glass panels
   * subtle data-motion ambience
4. Keep the scene aligned with your brand: backend engineering, system architecture, AI integration. Your current homepage already frames those themes clearly. ([Nguyen Van Hai Portfolio][1])

### Phase 3: Hero layout integration

1. Redesign the homepage hero into a two-layer composition:

   * **Foreground:** headline, subtext, CTA
   * **Background/right-side canvas:** 3D animation
2. Add responsive behavior:

   * desktop: full interactive 3D scene
   * tablet: reduced scene complexity
   * mobile: static poster image or very light motion
3. Maintain strong contrast and reading comfort so text remains dominant.

### Phase 4: Animation behavior and interaction design

1. Build the 3D animation around subtle premium motion:

   * idle floating
   * slow camera drift
   * soft parallax on pointer move
   * gentle response to scroll
2. Avoid heavy gimmicks like constant spinning objects or noisy particles.
3. Trigger entrance motion only once on initial load to keep the page feeling polished.
4. Add graceful fallback for users with `prefers-reduced-motion`.

### Phase 5: Homepage section polish

1. Connect the hero visually to the rest of the homepage using shared motion language:

   * soft reveal for “Quick profile”
   * staggered entrance for stats
   * elegant hover feedback on project and blog links
2. Add transition continuity from hero into the next section so the page feels like one narrative flow.
3. Keep the rest of the homepage minimal, because the 3D hero is now the main visual differentiator.

### Phase 6: Performance and delivery safety

1. Lazy-load the 3D bundle only for the homepage.
2. Split heavy assets from the main route bundle.
3. Use compressed geometry and optimized textures.
4. Pause or downgrade rendering when the tab is hidden.
5. Set a hard rule: Lighthouse performance should stay strong even with the hero added.
6. Ensure the page still communicates fully if the 3D layer fails to load.

### Phase 7: CMS and content flexibility

1. Extend your Sanity-driven plan so the homepage hero can be partially controlled from CMS:

   * hero heading
   * hero supporting text
   * CTA labels
   * optional scene mode or theme preset
2. Keep 3D implementation code-based, but expose content and simple display toggles to Sanity.
3. This keeps editorial control flexible while avoiding overly complex CMS management. This fits your earlier Sanity-centered roadmap. 

### Phase 8: Accessibility and production hardening

1. Ensure keyboard users can skip decorative motion.
2. Mark the 3D canvas as decorative unless it contains meaningful interaction.
3. Test fallback states across mobile and lower-end GPUs.
4. Validate SSR-safe loading patterns in SvelteKit so WebGL runs only on the client.
5. Finalize deployment checks on Vercel with homepage-specific testing.

