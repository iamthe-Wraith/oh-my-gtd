<script lang="ts">
    import Auth from '$lib/components/Auth.svelte';
    import { user } from '$lib/stores/user';
    import Signout from '$lib/components/forms/Signout.svelte';
    import Logo from '$lib/components/Logo.svelte';
    import Link from '$lib/components/Link.svelte';
</script>

<header data-testid="global-header">
    <Logo />

    <nav>
        {#if $user}
            <Link
                type="neutral"
                href="/dashboard"
                data-testid="dashboard-link"
            >
                Dashboard
            </Link>
            <Signout />
        {:else}
            <Auth allowOpenFromQueryParams />
        {/if}
    </nav>
</header>

<main data-testid="global-main" class="no-scrollbar">
    <slot></slot>  
</main>

<footer data-testid="global-footer">
    <div></div>
    <div>
        Copyright {new Date().getFullYear()}
    </div>
</footer>

<style>
    header,
    footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
        background-color: var(--dark-100);
        color: #fff;
    }

    header {
        height: 4rem;

        & nav {
            display: flex;
            gap: 1rem;
        }
    }

    footer {
        height: 3rem;
    }

    main {
        min-height: calc(100vh - 7rem);
    }
</style>