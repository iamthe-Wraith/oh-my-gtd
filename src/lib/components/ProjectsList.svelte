<script lang="ts">
    import type { Project as ProjectModel } from "@prisma/client";
    import ProjectListItem from "./ProjectListItem.svelte";

    export let projects: ProjectModel[] = [];
</script>

<div class="projects-list-container">
    {#each projects as project (project.id)}
        <ProjectListItem {project} />
    {:else}
        <p class="no-projects" data-testid="no-projects">No projects found</p>
    {/each}
</div>

<style>
    .projects-list-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 0.5rem;
    }

    .no-projects {
        padding-top: 2rem;
        color: var(--dark-700);
        text-align: center;
    }
</style>