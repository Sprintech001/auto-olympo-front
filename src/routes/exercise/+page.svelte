<script>
    import { onMount } from "svelte";
    import { selectedExerciseId, previousRoute } from "../../services/storelinks.js"; 
    import { goto } from "$app/navigation";
    
    import {
        IconBarbell, IconChevronLeft, IconClock, IconFlame, IconHeartbeat,
        IconRun, IconUser, IconInputCheck, IconLock
    } from "@tabler/icons-svelte";

    import OlympoYellow from "../../images/olympo-yellow.png";

    let exercise = { id: null, name: '', description: '', imagePath: '', videoPath: "" }; 
    let error = null;
    
    async function fetchExercise() {
        try {
            const exerciseId = $selectedExerciseId;
            if (!exerciseId) throw new Error("ID do exercício não encontrado");

            const response = await fetch(`http://191.252.195.85:5001/api/exercise/${exerciseId}`);
            if (!response.ok) throw new Error(`Erro: ${response.statusText}`);

            exercise = await response.json();
        } catch (err) {
            error = err.message;
        }
    }

    function goBack() {
        const previousRoute = sessionStorage.getItem("previousRoute");
        goto(previousRoute);
    }    

    onMount(fetchExercise);

    function startExercise() {
        sessionStorage.setItem("selectedExercise", JSON.stringify(exercise));
        goto("/exercise/execution"); 
    }
</script>

<section class="w-full min-h-dvh flex flex-col items-start gap-4 bg-[#2c2c2c]">
     <div id="hero"
        class="w-full h-60 flex items-start justify-between p-4 rounded-xl bg-cover bg-top"
        style="background-image: url('http://191.252.195.85:5001/api/Files/{exercise.imagePath}')">
        <a on:click={(e) => { 
                e.stopPropagation(); 
                goBack();
            }} 
            class="bg-[#2c2c2c] p-2 rounded-full border border-zinc-600"
        > 
            <IconChevronLeft color="#facc15"/> 
        </a>
    </div>

    <main class="w-full flex flex-col gap-8 py-4 px-8">
        <div id="texts" class="w-full flex flex-col items-center justify-center gap-4 text-white">
            <h2 class="text-3xl font-karantina uppercase">{exercise.name}</h2>
            <p class="">{exercise.description}</p>
        </div>

        <div id="info" class="w-full flex flex-wrap itmes-center justify-between text-white text-md">
            <div class="flex justify-between items-center gap-2">
                <IconBarbell color="#facc15" size="32"/>
                <span class="leading-5">Repetiçẽs <br><strong>3x12</strong></span>
            </div>
            <div class="flex justify-between items-center gap-2">
                <IconFlame color="#facc15" size="32"/>
                <span class="leading-5">Gastos <br><strong>140 Kcal</strong></span>
            </div>
        </div>
        <button 
            on:click={startExercise}
            class="flex items-center justify-center p-4 rounded-xl bg-[#facc15] text-black mt-4"
        >
            <IconInputCheck size="32" color="#2c2c2c" />
            <span class="text-2xl ml-1">Iniciar</span>
        </button>
    </main>
</section>

<style>
    #hero {
        background-size: cover;
        background-position: center;
    }

    #name {
        font-size: 2rem;
    }
</style>