<!--
    this app uses the IonIcons icon set, which can be
    found at: https://icon-sets.iconify.design/
-->

<script lang="ts" context="module">
    export type IconName =
        'alert-circle' |
        'checkmark' |
        'chevron-back' |
        'close' |
        'menu' |
        'note' |
        'trash' |
        'warning';
</script>

<script lang="ts">
    export let name: IconName;
</script>

{#if name === 'alert-circle'}
    <svg
        xmlns="http://www.w3.org/2000/svg" 
        width="1em" 
        height="1em" 
        viewBox="0 0 512 512" 
        {...$$props}
    >
        <path 
            fill="none" 
            stroke="currentColor" 
            stroke-miterlimit="10" 
            stroke-width="32" 
            d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192Z"
        />
        <path
            fill="none" 
            stroke="currentColor" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="32" 
            d="M250.26 166.05L256 288l5.73-121.95a5.74 5.74 0 0 0-5.79-6h0a5.74 5.74 0 0 0-5.68 6"
        />
        <path 
            fill="currentColor" 
            d="M256 367.91a20 20 0 1 1 20-20a20 20 0 0 1-20 20"
        />
    </svg>
{/if}

{#if name === 'checkmark'}
    <svg
        xmlns="http://www.w3.org/2000/svg" 
        width="1em" 
        height="1em" 
        viewBox="0 0 512 512" 
        {...$$props}
    >
        <path 
            fill="none" 
            stroke="currentColor" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="32" 
            d="M416 128L192 384l-96-96"
        />
    </svg>
{/if}

{#if name === 'chevron-back'}
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="1em" 
        height="1em" 
        viewBox="0 0 512 512" 
        {...$$props}
    >
        <path
            fill="none" 
            stroke="currentColor" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="48" d="M328 112L184 256l144 144"
        />
    </svg>
{/if}

{#if name === 'close'}
    <svg
        xmlns="http://www.w3.org/2000/svg" 
        width="1em" 
        height="1em" 
        viewBox="0 0 512 512" 
        {...$$props}
    >
        <path
            fill="none" 
            stroke="currentColor" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="32" 
            d="M368 368L144 144m224 0L144 368"
        />
    </svg>
{/if}

{#if name === 'menu'}
    <svg
        xmlns="http://www.w3.org/2000/svg" 
        width="1em" 
        height="1em" 
        viewBox="0 0 512 512" 
        {...$$props}
    >
        <path
            fill="none" 
            stroke="currentColor" 
            stroke-linecap="round" 
            stroke-miterlimit="10" 
            stroke-width="32" 
            d="M80 160h352M80 256h352M80 352h352"
        />
    </svg>
{/if}

{#if name === 'note'}
    <svg
        xmlns="http://www.w3.org/2000/svg" 
        width="1em" 
        height="1em" 
        viewBox="0 0 512 512" 
        {...$$props}
    >
        <rect 
            width="320" 
            height="416" 
            x="96" 
            y="48" 
            fill="none" 
            stroke="currentColor" 
            stroke-linejoin="round" 
            stroke-width="32" 
            rx="48" 
            ry="48"
        />
        <path
            fill="none" 
            stroke="currentColor" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="32" 
            d="M176 128h160m-160 80h160m-160 80h80" 
        />
    </svg>
{/if}

{#if name === 'trash'}
    <svg
        xmlns="http://www.w3.org/2000/svg" 
        width="1em" 
        height="1em" 
        viewBox="0 0 512 512" 
        {...$$props}
    >
        <path 
            fill="none" 
            stroke="currentColor" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="32" 
            d="m112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320"
        />
        <path 
            fill="currentColor" 
            stroke="currentColor" 
            stroke-linecap="round" 
            stroke-miterlimit="10" 
            stroke-width="32" 
            d="M80 112h352"
        />
        <path
            fill="none" 
            stroke="currentColor" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="32" 
            d="M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40m-64 64v224m-72-224l8 224m136-224l-8 224"
        />
    </svg>
{/if}

{#if name === 'warning'}
    <svg
        xmlns="http://www.w3.org/2000/svg" 
        width="1em" 
        height="1em" 
        viewBox="0 0 512 512" 
        {...$$props}
    >
        <path
            fill="none" 
            stroke="currentColor" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="32" 
            d="M85.57 446.25h340.86a32 32 0 0 0 28.17-47.17L284.18 82.58c-12.09-22.44-44.27-22.44-56.36 0L57.4 399.08a32 32 0 0 0 28.17 47.17"
        />
        
        <path 
            fill="none" 
            stroke="currentColor" 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="32" 
            d="m250.26 195.39l5.74 122l5.73-121.95a5.74 5.74 0 0 0-5.79-6h0a5.74 5.74 0 0 0-5.68 5.95"
        />
        
        <path 
            fill="currentColor" 
            d="M256 397.25a20 20 0 1 1 20-20a20 20 0 0 1-20 20"
        />
    </svg>
{/if}