<script lang="ts">
    import type { Project } from "@prisma/client";
    import IconWithTooltip from "./IconWithTooltip.svelte";
    import dayjs from "dayjs";
    import CompleteProject from "./forms/CompleteProject.svelte";
    import Icon from "./Icon.svelte";

    export let project: Project;

    const daysUntilDue = dayjs(project.dueDate).diff(dayjs(), "day");
    const hasTags = false;
</script>

<div
    data-testid="{project.id}"
    class="project-container {(daysUntilDue < 0 && !project.completed) ? 'past-due' : ''} {project.completed ? 'completed' : ''}"
>
    <div class="complete-project-container {daysUntilDue < 0 ? 'past-due' : ''}">
        <CompleteProject {project}>
            <button type="submit" class={project.completed ? 'completed' : ''} data-testid="project-complete-button">
                <Icon name="checkmark" data-testid="project-complete-button-icon"/>
            </button>
        </CompleteProject>
    </div>
    <a
        class="project {daysUntilDue < 0 ? 'past-due' : ''}"
        href={`/projects/${project.id}`}
    >
        <div class="project-main">
            <div>
                <p
                    data-testid="project-title"
                    class={`title ${project.completed ? 'completed' : ''}`}
                >
                    {project.title}
                </p>
            </div>

            {#if project.dueDate && !project.completed}
                <div class="due-date">
                    {#if daysUntilDue < 0}
                        <p class="past-due">Was due {Math.abs(daysUntilDue)} days ago</p>
                    {:else if daysUntilDue === 0}
                        <p class="due-today">Due Today</p>
                    {:else if daysUntilDue === 1}
                        <p>Due Tomorrow</p>
                    {:else}
                        <p>Due in {daysUntilDue} days</p>
                    {/if}
                </div>
            {/if}
            
            {#if hasTags}
                <div class="project-tags"></div>
            {/if}
        </div>
        <div class="project-icons-container">
            <div class="project-icons">
                {#if daysUntilDue < 0}
                    <IconWithTooltip
                        icon="alert-circle" 
                        text="Past Due"
                        testid="past-due-icon"
                    />
                {/if}
            </div>
        </div>
    </a>
</div>

<style>
    .project-container {
        container-type: inline-size;
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        border-radius: 0.25rem;
        transition: 0.25s ease-in-out transform, 0.25s ease-in-out border;

        &.completed {
            opacity: 0.5;
        }

        &:has(.project:hover),
        &:has(.project:focus-visible) {
            /* border: 1px solid var(--primary-200); */
            transform: scale(1.01);
        }

        &:has(.project:focus-visible) {
            outline: 1px dashed var(--light-500);
		    outline-offset: 2px;
        }
    }

    .complete-project-container {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-grow: 0;
        flex-shrink: 0;
        width: 3.5rem;
        padding: 0.5rem 0;
        border-top-left-radius: 0.25rem;
        border-bottom-left-radius: 0.25rem;
        background: var(--primary-200);

        &.past-due {
            background: var(--danger-400);
        }

        & form {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            width: 100%;
            height: 100%;
        }

        & button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1.75rem;
            height: 1.75rem;
            border: none;
            border-radius: 0.25rem;
            background: var(--dark-300);

            & svg {
                font-size: 3rem;
                transition: 0.25s ease-in-out opacity;
                opacity: 0;
            }

            &:hover,
            &.completed {
                cursor: pointer;

                & svg {
                    opacity: 0.75;
                }
            }
        }
    }

    .project {
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        flex-grow: 1;
        gap: 1rem;
        min-height: 3.5rem;
        padding: 0.5rem 1rem;
        border: 1px solid transparent;
        border-left: none;
        border-top-right-radius: 0.25rem;
        border-bottom-right-radius: 0.25rem;
        background: var(--dark-400);
        outline: none;
        text-decoration: none;
        transition: 0.25s ease-in-out border;
        
        &:hover {
            border: 1px solid var(--primary-200);
            border-left: none; 
            cursor: pointer;
        }

        &.past-due:hover {
            border: 1px solid var(--danger-400);
            border-left: none;
        }
    }

    .project-main {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 0.25rem;

        & .title {
            font-size: 1.1rem;
            font-weight: bold;
            text-align: left;
        }

        & .completed {
            text-decoration: line-through;
        }

        & .due-date {
            & p {
                font-size: 0.8rem;
                color: var(--dark-900);

                &.past-due {
                    color: var(--danger-400);
                }

                &.due-today {
                    color: var(--primary-500);
                }
            }
        }
    }

    .project-icons-container {
        display: flex;
        justify-content: flex-end;
        align-items: flex-end;
        flex-grow: 0;
        flex-shrink: 0;
        gap: 0.5rem;
    }

    .project-icons {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        align-items: end;
        direction: rtl;
        gap: 0.5rem;
        width: 4rem;
    }

    @container (width < 475px) {
        .project {
            flex-direction: column;
            gap: 0.5rem;
            padding: 0.5rem;
        }

        .project-icons {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            justify-content: flex-start;
            gap: 0.5rem;
            width: 100%;
            direction: unset;
        }
    }
</style>