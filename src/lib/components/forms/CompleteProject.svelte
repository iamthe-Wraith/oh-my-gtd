<script lang="ts">
    import { goto } from "$app/navigation";
    import { enhance } from "$app/forms";
    import type { Project } from "@prisma/client";
    import type { ActionResult } from "@sveltejs/kit";
    import { toast } from "$lib/stores/toast";

    export let project: Project;

    let processing = false;

    function onSubmitResponse() {
        processing = true;

        return ({ result }: { result: ActionResult<{ message: string }> }) => {
            if (result.type === 'redirect') {
                goto(result.location);
            }
            
            if (result.type === 'failure') {
                toast.add({ message: 'Error completing project', type: 'error' });
            }

            if (result.type === 'success') {            
                window.location.reload();
            }

            processing = false;
        }
    };
</script>

<form
    method="POST" 
    action={'/projects?/update'}
    use:enhance={onSubmitResponse}
>
    <input type="hidden" name="id" value="{project.id}" />
    <input type="hidden" name="title" value="{project.title}" />
    <input type="hidden" name="description" value="{project.description}" />
    <input type="hidden" name="completed" value={!project.completed} />

    <!--
        using slot because different kinds of submit buttons are used throughout the app.
        it's the calling component's responsibility to provide the button with a type of
        "submit" and any other necessary attributes.
    -->
    <slot />
</form>
