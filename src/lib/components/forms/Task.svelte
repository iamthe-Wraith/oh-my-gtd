<script lang="ts">
    import { onMount } from "svelte";
    import Button from "../Button.svelte";
    import TextInput from "../TextInput.svelte";
    import Textarea from "../Textarea.svelte";
    import { enhance } from "$app/forms";
    import type { ActionResult } from "@sveltejs/kit";
    import type { IApiError } from "$lib/utils/api-error";
    import { goto } from "$app/navigation";
	import type { Task } from "@prisma/client";
	import dayjs from "dayjs";
	
    type FormField = 'title' | 'notes' | 'dueDate';

    export let onCancel: () => void = () => {};
    export let task: Task | null = null;

    let processing = false;
    let title = task?.title || '';
    let notes = task?.notes || '';
    let disabled = true;

    let titleError = '';
    let notesError = '';
    let genError = '';

    $: title = task?.title || '';
    $: notes = task?.notes || '';
    $: disabled = title === '';
    
    onMount(() => {
        reset();

        return reset;
    })

    function onCancelClick() {
        reset();
        onCancel?.();
    }

    function onSubmitResponse() {
        processing = true;

        return ({ result }: { result: ActionResult<{ message: string }> }) => {
            if (result.type === 'redirect') {
                goto(result.location);
            }
            
            if (result.type === 'failure') {
                if (result.data?.errors) {
                    result.data.errors.map((e: IApiError) => {
                        switch (e.field) {
                            case 'title':
                                titleError = e.message;
                                break;
                            case 'notes':
                                notesError = e.message;
                                break;
                            default:
                                genError = e.message;
                                break;
                        }
                    })
                } else {
                    genError = 'Something went wrong. Please try again later.';    
                }
            }

            if (result.type === 'success') {
                reset();                
                window.location.reload();
            }

            processing = false;
        }
    };

    function onBlur(field: FormField) {
        return function() {
            switch (field) {
                case 'title':
                    title = title.trim();
                    if (!title) {
                        titleError = 'Title is required.';
                    } else {
                        titleError = '';
                    }
                    break;
                case 'notes':
                    notes = notes.trim();
                    break;
            }
        }
    }

    function reset() {
        title = '';
        notes = '';
    }
</script>

<form
    data-testid="task-form"
    method="POST" 
    action=""
    use:enhance={onSubmitResponse}
>
    <TextInput
        required
        id="title"
        data-testid="task-title"
        label="Title"
        placeholder="Task Title"
        error={titleError}
        bind:value={title}
        on:blur={onBlur('title')}
    />

    <Textarea
        id="notes"
        data-testid="task-notes"
        label="Notes"
        placeholder="Task Notes"
        error={notesError}
        bind:value={notes}
        on:blur={onBlur('notes')}
    />

    {#if task?.dueDate}
        <p>Due on {task?.dueDate ? dayjs(task?.dueDate).format('MMM DD, YYYY') : ''}</p>
    {/if}

    {#if genError}
        <p class="error" data-testid="task-gen-error">{genError}</p>
    {/if}

    <div class="buttons-container">
        <Button
            id="task-create"
            data-testid="task-create"
            kind="primary"
            type="submit"
            {disabled}
            {processing}
        >
            {!!task ? 'Update' : 'Create'}
        </Button>
    
        <Button
            id="task-cancel"
            data-testid="task-cancel"
            kind="transparent"
            type="button"
            on:click={onCancelClick}
        >
            Cancel
        </Button>
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 80vw;
        max-width: 30rem;
    }

    .error {
        margin: 0;
    }

    .buttons-container {
        display: flex;
        flex-direction: row-reverse;
        justify-content: flex-start;
        align-items: center;
        gap: 1rem;
    }
</style>