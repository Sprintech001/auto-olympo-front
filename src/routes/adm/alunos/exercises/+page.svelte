<script>
    import { IconChevronLeft, IconRowInsertBottom } from "@tabler/icons-svelte";
    import avatar from "../../../../images/avatar.png";
    import { page } from '$app/stores';
    import ExerciseCard from '../../../../lib/ExerciseCard.svelte';
    import ShowOptions from '../../../../lib/ShowOptions.svelte';
    import ShowExercises from "$lib/ShowExercises.svelte";
    import { sessionStore } from '/src/services/storelinks.js';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let aluno = null;
    let exercises = [];
    let error = null;
    let selectedExercise = null;
    let showExercise = false;
    let uniqueExercises = [];
    let showModal = false;

    async function getUserExercises(userId) {
        try {
            const response = await fetch(`http://191.252.195.85:5001/api/userexercise/user/${userId}`);
            if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
            const data = await response.json();
            console.log('data:', data);
            return data["$values"] || data;
        } catch (err) {
            console.error("Erro ao buscar exercícios do usuário:", err);
            error = err.message;
            return [];
        }
    }

    function getUniqueExercises(exercises) {
        const seen = new Set();
        return exercises.filter(ex => {
            if (!seen.has(ex.exerciseId)) {
                seen.add(ex.exerciseId);
                return true;
            }
            return false;
        });
    }

    async function carregarExercicios() {
        exercises = await getUserExercises(aluno.appUser.id);
        uniqueExercises = getUniqueExercises(exercises);
    }

    function updateExercises() {
        carregarExercicios();
    }

    function toggleOptions(exercise) {
        selectedExercise = selectedExercise && selectedExercise.id === exercise.id ? null : exercise;
    }

    function closeOptions() {
        selectedExercise = null;
    }

    function insertExercise() {
        showExercise = !showExercise;
        console.log('showExercise:', showExercise);
    }

    function visualizarSessoes(exercise) {
        sessionStore.set(exercise);
        console.log('exercise:', exercise);
        goto("/adm/alunos/exercises/sessions" //, { state: { userId: aluno?.appUser?.id }, replaceState: true }
        ); 
    }

    function openModal(exercise) {
        console.log('Abrindo modal para o exercício:', exercise); 
        selectedExercise = exercise;
        console.log('selectedExercise:', selectedExercise.exerciseId);
        showModal = true;
    }

    function closeModal() {
        console.log('Fechando modal'); 
        selectedExercise = null;
        showModal = false;
    }

    onMount(() => {
        const alunoData = page?.state?.aluno || JSON.parse(sessionStorage.getItem('aluno'));
        
        if (alunoData?.$values) {
            aluno = alunoData.$values[0];
            sessionStorage.setItem('aluno', JSON.stringify({ $values: [aluno] }));
        } else if (alunoData?.appUser) {
            aluno = alunoData; 
        } else {
            console.log('Aluno não encontrado no estado ou no sessionStorage.');
        }

        const appUserId = aluno?.appUser?.id || alunoData?.$values?.[0]?.appUser?.id;
        if (appUserId) {
            aluno = { ...aluno, appUser: { ...aluno.appUser, id: appUserId } }; 
            console.log('id:', aluno.appUser.id); 
            carregarExercicios();
        } else {
            console.error("appUser.id não encontrado.");
            error = "Erro ao carregar dados do aluno.";
        }
    });

</script>

<section class="w-full min-h-dvh flex flex-col items-start py-4 px-8 gap-8 bg-[#2c2c2c] font-karantina uppercase">
    <div id="head" class="w-full flex justify-between">
        <a href="/adm/alunos/" class="bg-[#2c2c2c] p-2 rounded-full border border-zinc-600">
            <IconChevronLeft color="#facc15" />
        </a>
    </div>

    <main class="w-full flex flex-col gap-8">
        <div id="exercicios" class="w-full flex flex-col gap-4 text-white">
            {#if aluno}
                <div class="w-full flex justify-between items-center mt-4 mb-4">
                    <h2 class="text-5xl">{aluno.userName}</h2>
                    <button 
                        class="w-28 flex items-center justify-center px-2 py-3 rounded-xl bg-[#facc15] text-black"
                        on:click={insertExercise}>
                        <span class="text-xl ml-1">Exercício</span>
                    </button>
                </div>
            {/if}

            {#if showExercise}
                <ShowExercises userId={aluno.appUser.id} exerciseUser={exercises} onExercisesCreated={updateExercises} />
            {/if}

            {#if error}
                <div class="text-red-500">{error}</div>
            {:else if uniqueExercises.length === 0}
                <div class="text-gray-400">Nenhum exercício encontrado.</div>
            {:else}
                {#each uniqueExercises as uniqueExercise}
                    <div class="relative">
                        <ExerciseCard 
                            exercise={uniqueExercise} 
                            onExercisesCreated={updateExercises} 
                            route="/exercises"
                            viewDelete={true}
                        />
                        <button class="absolute top-2 right-2 bg-gray-700 text-white p-2 rounded" 
                            on:click={() => openModal(uniqueExercise)} >
                            Ajustar exercício
                        </button>
                    </div>
                {/each}
            {/if}
        </div>

        {#if uniqueExercises.length > 0}
            <div>
                <a on:click={() => visualizarSessoes(uniqueExercises[0])}
                    class="w-full flex items-center justify-center p-4 rounded-xl bg-[#facc15] text-black cursor-pointer">
                    <IconRowInsertBottom size="32" color="#2c2c2c" />
                    <span class="text-2xl ml-1">Visualizar Sessões</span>
                </a>
            </div>
        {/if}
    </main>

    {#if showModal}
        <div class="modal-overlay" on:click={closeModal}>
            <div class="modal-content" on:click|stopPropagation>
                <button class="close-button" on:click={closeModal}>X</button>
                <ShowOptions 
                    {selectedExercise} 
                    on:close={closeModal} 
                    exerciseId={selectedExercise.exerciseId} 
                    userId={aluno.appUser.id} 
                />
            </div>
        </div>
    {/if}
</section>

<style>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: #1a1a1a;
        padding: 2rem;
        border-radius: 0.5rem;
        width: 90%;
        max-width: 500px;
        color: white;
        position: relative;
    }

    .close-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: transparent;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
    }

    .close-button:hover {
        color: #facc15;
    }
</style>
