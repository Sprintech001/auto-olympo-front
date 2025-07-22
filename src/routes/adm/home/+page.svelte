<script>
      import { onMount } from 'svelte';
    import OlympoYellow from "../../../images/olympo-yellow.png";
    import Avatar from '../../../images/avatar.png';
    import { IconFlame, IconHeartbeat, IconRun } from "@tabler/icons-svelte";
    import { userSession } from "../../../services/storelinks"; 
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    let user;  
    $: $userSession && (user = $userSession);

    onMount(() => {
        sessionStorage.setItem('previousRoute', $page.url.pathname);
    });

    function navigateTo(newRoute) {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem("previousRoute", $page.url.pathname);
        }
        goto(newRoute);
    }
</script>

<section class="w-full min-h-dvh flex flex-col items-start py-4 px-8 gap-4 bg-[#2c2c2c] font-karantina uppercase">
    <div id="head" class="w-full">
        <div class="w-full flex justify-end">
            <img src={OlympoYellow} alt="Logo Olympo" class="w-6 rounded-full" />
        </div>
        <a 
            on:click={() => {
                navigateTo("/user");
            }}
        class="w-full flex gap-4 items-center">
            <img
                src={user?.imagePath ? `http://localhost:5001/api/Files/${user.imagePath}` : Avatar}
                alt="Avatar"
                class="w-20 h-20 rounded-full object-cover"
            />
            <h1 class="w-3/5 text-white text-2xl font-karantina">
                Bem vindo de volta <br />{user?.name || "Usuário"}
            </h1>
        </a>
    </div>

    <main class="w-full flex flex-col gap-8">
        <div id="estatisticas" class="w-full flex items-center justify-between capitalize">
            <div id="repeticoes" class="w-24 h-24 flex flex-col items-center justify-center bg-[#D9D9D9] bg-opacity-10 rounded-xl">
                <IconRun size="32" color="#facc15" />
                <h2 class="text-xl text-white">1893</h2>
                <span class="text-white">Repetições</span>
            </div>
            <div id="kcal" class="w-24 h-24 flex flex-col items-center justify-center bg-[#D9D9D9] bg-opacity-10 rounded-xl">
                <IconFlame size="32" color="#facc15" />
                <h2 class="text-xl text-white">6.835 Kcal</h2>
                <span class="text-white">Por exercício</span>
            </div>
            <div id="bpm" class="w-24 h-24 flex flex-col items-center justify-center bg-[#D9D9D9] bg-opacity-10 rounded-xl">
                <IconHeartbeat size="32" color="#facc15" />
                <h2 class="text-xl text-white">123</h2>
                <span class="text-white">BPM</span>
            </div>
        </div>

        <div id="exercicios" class="w-full flex flex-col gap-4 text-white">
            <div class="bg-[#D9D9D9] bg-opacity-10 p-4 rounded-xl">
                <a href="/adm/alunos" class="text-2xl">Ver alunos</a>
            </div>
            <div class="bg-[#D9D9D9] bg-opacity-10 p-4 rounded-xl">
                <a href="/adm/exercises" class="text-2xl">Exercicios salvos</a>
            </div>
        </div>
    </main>
</section>

<style>
</style>