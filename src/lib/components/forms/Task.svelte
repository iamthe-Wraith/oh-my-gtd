<script lang="ts">
    import type { ActionResult } from "@sveltejs/kit";
    import { onMount } from "svelte";
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import type { Task } from "@prisma/client";
    import dayjs from "dayjs";
    import { contexts } from '$lib/stores/contexts';
    import Button from "../Button.svelte";
    import TextInput from "../TextInput.svelte";
    import Textarea from "../Textarea.svelte";
    import type { IApiError } from "$lib/utils/api-error";
    import Dropdown from "../Dropdown.svelte";
    import { MAX_PROJECT_DESCRIPTION_LENGTH } from "$lib/constants/project";
    import { MAX_TASK_TITLE_LENGTH } from "$lib/constants/task";
	
    type FormField = 'title' | 'description' | 'dueDate';

    export let onCancel: () => void = () => {};
    export let task: Task | null = null;

    const context = $contexts?.find(c => c.id === task?.contextId);

    let processing = false;
    let title = task?.title || '';
    let description = task?.description || '';
    let contextValue = context ? { label: context.name, value: context.id } : null;
    let contextItems = $contexts ? $contexts.map(c => ({ label: c.name, value: c.id })) : [];
    let disabled = true;

    let titleError = '';
    let descriptionError = '';
    let contextError = '';
    let genError = '';

    $: disabled = !title || !!titleError || !!descriptionError || !!contextError || !!processing;
    
    onMount(() => {
        return reset;
    })

    function onCancelClick() {
        reset();
        onCancel?.();
    }

    function onContextChange(e: CustomEvent<{ label: string; value: number }>) {
        contextError = '';
        contextValue = e.detail;
    }

    function onContextClear() {
        contextError = 'A context is required.';
        contextValue = null;
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
                            case 'description':
                                descriptionError = e.message;
                                break;
                            case 'contextId':
                                contextError = e.message;
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
                    } else if (title.length > MAX_TASK_TITLE_LENGTH) {
                        titleError = `Title must be less than ${MAX_TASK_TITLE_LENGTH} characters.`;
                    } else {
                        titleError = '';
                    }
                    break;
                case 'description':
                    description = description.trim();
                    if (description && description.length > MAX_PROJECT_DESCRIPTION_LENGTH) {
                        descriptionError = `Description must be less than ${MAX_PROJECT_DESCRIPTION_LENGTH} characters.`;
                    } else {
                        descriptionError = '';
                    }
                    break;
            }
        }
    }

    function reset() {
        title = task?.title || '';
        description = task?.description || '';
        titleError = '';
        descriptionError = '';
        contextError = '';
        genError = '';
        disabled = true;
    }
</script>

<form
    data-testid="task-form"
    method="POST" 
    action={!!task ? `/tasks?/update` : '/tasks?/create'}
    use:enhance={onSubmitResponse}
>
    {#if !!task}
        <input type="hidden" name="id" value={task?.id} />
    {/if}

    <div class="row">
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
    </div>

    <div class="row">
        <Textarea
            id="description"
            data-testid="task-description"
            label="Description"
            placeholder="Task Description"
            error={descriptionError}
            bind:value={description}
            on:blur={onBlur('description')}
        />
    </div>

    <div class="row">
        <Dropdown
            id="context"
            label="Context"
            name="contextId"
            items={contextItems}
            placeholder="Select a Context"
            value={contextValue}
            error={contextError}
            on:change={onContextChange}
            on:clear={onContextClear}
        />

        <div></div>
    </div>

    {#if task?.dueDate}
        <p>Due on {task?.dueDate ? dayjs(task?.dueDate).format('MMM DD, YYYY') : ''}</p>
    {/if}

    {#if genError}
        <p class="error" data-testid="task-gen-error">{genError}</p>
    {/if}

    <div class="buttons-container">
        <Button
            id="task-create"
            data-testid={!!task ? 'task-update' : 'task-create'}
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
        max-width: 40rem;

        & .row {
            display: flex;
            flex-direction: row;
            gap: 1rem;

            & > * {
                flex: 1;
            }
        }
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