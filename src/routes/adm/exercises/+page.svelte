<script>
    import {
        IconFlame, IconHeartbeat, IconRun, IconUser, IconChevronLeft, IconAddressBook, IconCreativeCommons, 
        IconCreditCard, IconInputSearch, IconInnerShadowBottomRightFilled, IconRowInsertBottom,
    } from "@tabler/icons-svelte";

    import { IconLock } from "@tabler/icons-svelte";
    import { BarChart, Svg, Axis, Bars } from "layerchart";
    import { onMount } from 'svelte';
    import { selectedExerciseId, setSelectedExercise } from '../../../services/storelinks.js';
    
    export let exercise;
    let exercises = [];
    let error = null;

    async function fetchExercises() {
        try {
            const response = await fetch('/api/exercise');
            if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
            }
            const data = await response.json();
            exercises = data;
            console.log(exercises);
        } catch (err) {
            error = err.message;
        }
    }

    const deleteExercise = async (exerciseId) => {

        try {
            const response = await fetch(`/api/exercise/${exerciseId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir exercício.");
            }

            exercises = exercises.filter(exercise => exercise.id !== exerciseId);
        } catch (error) {
            console.error("Erro ao excluir exercício:", error);
        }
    };

    onMount(() => {
        fetchExercises();
    });
</script>

<section class="w-full min-h-dvh flex flex-col items-start py-4 px-8 gap-4 bg-[#2c2c2c] font-karantina uppercase">
    <div id="head" class="w-full">
        <div class="w-full flex justify-between">
            <a href="/adm/home" class="bg-[#2c2c2c] p-2 rounded-full border border-zinc-600"> 
                <IconChevronLeft color="#facc15"/> 
            </a>
        </div>
    </div>

    <main class="w-full flex flex-col gap-8">

        <div id="exercicios" class="w-full flex flex-col gap-4 text-white">
            <div class="w-full flex justify-between items-center mt-4 mb-4">
                <h2 class="text-4xl">Exercícios</h2>
            </div>

            <div class="w-full flex flex-col gap-0">
                {#each exercises as exercise}
                <a href="/adm/exercises/edit" 
                    class="w-full h-44 flex flex-col items-start justify-center p-4 rounded-xl bg-cover bg-top"  
                    style={`background-image: url('/api/Files/${exercise.imagePath}')`}
                    on:click={() => setSelectedExercise(exercise.id)}>

                    <h2 class="text-5xl">{exercise.name}</h2>

                </a>
                <button id="lixo" type="button" on:click={() => deleteExercise(exercise.id)}>
                    <img src="/src//lixeira.svg" alt="Excluir">
                </button>
                {/each}
            </div>
        </div>
    </main>
    <div>
        <a href="/adm/exercises/create" class="w-full flex items-center justify-center p-4 rounded-xl bg-[#facc15] text-black">
            <IconRowInsertBottom size="32" color="#2c2c2c" />
            <span class="text-2xl ml-1">Criar novo exercício</span>
        </a>
    </div>
</section>

<style>
    #lixo {
        position: relative;
        top: -10rem;
        right: -16.4rem;
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
