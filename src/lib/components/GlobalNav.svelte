<script lang="ts">
    import { type Context } from '@prisma/client';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { ContextRole } from '../../types/contexts';
    import { user } from '$lib/stores/user';
    import { errors } from '$lib/stores/errors';
    import { contexts } from '$lib/stores/contexts';
    import Signout from './forms/Signout.svelte';
    import Avatar from './Avatar.svelte';
    import NewQuickTask from './modals/NewQuickTaskModal.svelte';
    import NewQuickProject from './modals/NewQuickProjectModal.svelte';
    import Button from './Button.svelte';

    let nav: HTMLElement;

    let loadingError: string;
    let contextsWithRoles: Context[] = [];
    let contextsWithoutRoles: Context[] = [];

    $: if ($errors && $errors.length) {
            const error = $errors.find(e => e.field === 'contexts');
            if (error) loadingError = error.message;
        }

    $: if ($contexts && $contexts.length) {
            contextsWithRoles = $contexts.filter(c => c.role !== ContextRole.NONE);
            contextsWithoutRoles = $contexts.filter(c => c.role === ContextRole.NONE);
        }

    onMount(() => {
        nav.addEventListener('click', e => {
            e.stopPropagation();
        });

        nav.addEventListener('touchstart', e => {
            e.stopPropagation();
        });
    })
</script>

<nav
    data-testid="global-nav"
    bind:this={nav}
>
    <div class="upper-nav">
        {#if !loadingError}
            <div
                data-testid="quick-actions"
                class="nav-section quick-actions"
            >
                <NewQuickProject let:openNewQuickProjectModal>
                    <Button
                        data-testid="new-quick-project-button"
                        kind="secondary"
                        on:click={openNewQuickProjectModal}
                    >
                        New Project
                    </Button>
                </NewQuickProject>
                
                <NewQuickTask let:openNewQuickTaskModal>
                    <Button
                        data-testid="new-quick-task-button"
                        kind="primary"
                        on:click={openNewQuickTaskModal}
                    >
                        New Task
                    </Button>
                </NewQuickTask>
            </div>
        {/if}

        <div class="nav-section">
            <a
                href="/dashboard" 
                class={$page.url.pathname === '/dashboard' ? 'active' : ''}
            >
                Dashboard
            </a>
        </div>

        {#if loadingError}
            <div class="loading-error">
                {loadingError}
            </div>
        {/if}
        
        {#if !loadingError && contextsWithRoles.length}
            <div class="nav-section">
                {#each contextsWithRoles as context}
                    <a
                        href={`/${context.role.toLocaleLowerCase()}`}
                        class={$page.url.pathname === `/${context.role.toLocaleLowerCase()}` ? 'active' : ''}
                    >
                        {context.name}
                    </a>
                {/each}

                <a
                    href="/projects"
                    class={$page.url.pathname === '/projects' ? 'active' : ''}
                >
                    Projects
                </a>
            </div>
        {/if}

        {#if !loadingError && contextsWithoutRoles.length}
            <div class="nav-section">
                {#each contextsWithoutRoles as context}
                    <a
                        href={`/contexts/${context.id}`}
                        class={$page.url.pathname === `/contexts/${context.id}` ? 'active' : ''}
                    >
                        {context.name}
                    </a>
                {/each}
            </div>
        {/if}

        {#if $user?.role === 'ADMIN' || $user?.role === 'SUPER_ADMIN'}
            <div class="nav-section">
                <p class="restricted-areas-container">Restricted Areas</p>
                
                {#if $user?.role === 'ADMIN' || $user?.role === 'SUPER_ADMIN'}
                    <a
                        href="/admin"
                        class={$page.url.pathname === '/admin' ? 'active' : ''}
                    >
                        Admin
                    </a>
                {/if}
            </div>
        {/if}
    </div>

    <div class="lower-nav">
        <a
            class="user-info-container"
            href="/settings"
            data-testid="settings-link"
        >
            <div class="avatar-container" data-testid="user-avatar">
                <Avatar size="medium" />
            </div>
            <div class="user-info" data-testid="user-email">
                <div class="email">{ $user?.email }</div>
            </div>
        </a>

        <Signout />

        <p class="copyright">
            Copyright {new Date().getFullYear()}
        </p>
    </div>
</nav>

<style>
    nav {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: stretch;
        width: 100%;
        height: 100%;
        overflow: auto;
    }

    .restricted-areas-container {
        margin: 0;
        padding: 0 0.5rem;
        font-size: 0.75rem;
        color: var(--danger-500);
        text-transform: uppercase;
    }

    .upper-nav {
        & .loading-error {
            padding: 3rem 0 1rem;
            text-align: center;
            color: var(--dark-700);
        }

        & .nav-section {
            padding: 0.5rem 0.25rem;

            &:not(:last-of-type) {
                border-bottom: 1px solid var(--dark-400);
            }
        }

        & .quick-actions {
            display: none;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
            width: 100%;
            padding: 1rem 0.5rem;

            @media (min-width: 768px) {
                display: grid;
            }
        }

        & a {
            display: block;
            width: 100%;
            padding: 0.5rem 1rem;
            font-size: 1rem;
            font-weight: 500;
            text-decoration: none;

            &:not(.active):hover {
                background-color: var(--dark-400);
            }

            &.active {
                border-right: 3px solid var(--primary-500);
                color: var(--primary-500);
                pointer-events: none;
            }

            @media (min-width: 768px) {
                padding: 0.5rem 1rem;
            }
        }
    }

    .lower-nav {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
    }

    .user-info-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        width: calc(100% - (var(--outline-offset) * 2));
        margin: 0 var(--outline-offset) 0.5rem;
        padding: 0.5rem;
        text-decoration: none;

        &:hover {
            background-color: var(--dark-400);
        }

        & .user-info {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
        }
    }

    .copyright {
        font-size: 0.75rem;
        color: var(--dark-700);
    }
</style>