<script>
    import { selectedExerciseId, previousRoute } from '../services/storelinks.js';
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { sessionStore } from '/src/services/storelinks.js'; 

    export let exercise = {}; 
    export let route = "";
    export let onExercisesCreated;
    export let viewDelete = false;

    let exerciseDetails = null; 

    async function getExerciseById(exerciseId) {
        try {
            const response = await fetch(`http://191.252.195.85:5001/api/exercise/${exerciseId}`);

            if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
            }

            exerciseDetails = await response.json();
            console.log('Detalhes do exercício:', exerciseDetails);
        } catch (error) {
            console.error('Erro ao buscar exercício:', error);
        }
    }

    $: {
        if (exercise && exercise.exerciseId) {
            getExerciseById(exercise.exerciseId);
        }
    }

    $: sessionStorage.setItem("previousRoute", $page.url.pathname);

    function navigateTo(newRoute) {
        sessionStorage.setItem("previousRoute", $page.url.pathname);
        goto(newRoute);
    }

    async function deleteUserExercise(userId, exerciseId) {
        console.log(`Tentando excluir o relacionamento User-Exercise para userId=${userId} e exerciseId=${exerciseId}`);

        try {
            const response = await fetch(`http://191.252.195.85:5001/api/userexercise?userId=${userId}&exerciseId=${exerciseId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Relacionamento excluído com sucesso!');
                onExercisesCreated(); 
            } else {
                console.error('Erro ao excluir relacionamento:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao excluir relacionamento:', error);
        }
    }

</script>

<div class="w-full flex flex-col gap-4">
    {#if exerciseDetails}
        <a
            on:click={() => {
                navigateTo("/exercise");
                selectedExerciseId.set(exerciseDetails.id);
            }}
            class="w-full h-44 flex flex-col items-start justify-center p-4 rounded-xl bg-cover bg-top"
            style={`background-image: url('http://191.252.195.85:5001/api/Files/${exerciseDetails.imagePath}')`}
        >
            <h2 class="text-5xl">{exerciseDetails.name}</h2>
        </a>
    {:else}
        <div class="w-full h-44 flex items-center justify-center bg-gray-200 rounded-xl animate-pulse">
            <span class="text-gray-500">Carregando exercício...</span>
        </div>
    {/if}


    {#if (viewDelete)}
        <button id="lixo" type="button" on:click={() => deleteUserExercise(exercise.userId, exercise.exerciseId)}>
            <img src="/src/images/lixeira.svg" alt="Excluir">
        </button>
    {/if}
</div>

<style>
    #lixo {
        position: relative;
        top: -4rem;
        right: -15rem;
        background-color: #171717;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        width: 35px;
        height: 35px;
        border: none;
        cursor: pointer;
    }

    #lixo img {
        position: relative;
        left: 5px;
        width: 24px;
        height: 24px;
    }
</style>
