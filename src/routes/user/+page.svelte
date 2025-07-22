<script>
    import OlympoYellow from "../../images/olympo-yellow.png";
    import Avatar from '../../images/avatar.png';
    import { userSession } from '/src/services/storelinks.js';
    import { goto } from "$app/navigation"; 
    import {
        IconBell,
        IconChevronLeft,
        IconChevronRight,
        IconFlame,
        IconHeartbeat,
        IconHelp,
        IconRun,
        IconSettings,
        IconUser,
        IconLogout,
    } from "@tabler/icons-svelte";
    import { clearUserSession } from '/src/services/storelinks.js';
    function logout() {
        clearUserSession();
        goto('/login');
    }

    let user;
    $: $userSession && (user = $userSession);

    function goBack() {
        if (typeof window !== 'undefined') {
            const previousRoute = sessionStorage.getItem("previousRoute") || "/";
            goto(previousRoute);
        }
    }    

    console.log("Dados de userSession:", $userSession);
</script>

<section class="w-full min-h-dvh flex flex-col items-start py-4 px-8 gap-4 bg-[#2c2c2c] font-karantina uppercase">
    <div id="head" class="w-full">
        <div class="w-full flex justify-between">
            <a 
                on:click={() => {
                    goBack();
                }}
            class="bg-[#2c2c2c] p-2 rounded-full border border-zinc-600"> <IconChevronLeft color="#facc15"/> </a>
            <img src={OlympoYellow} alt="Logo Olympo" class="w-8 h-8 rounded-full" />
        </div>
        <div class="w-full flex flex-col gap-4 items-center text-center">
            <img
                src={user?.imagePath ? `http://localhost:5001/api/Files/${user.imagePath}` : Avatar}
                alt="Avatar"
                class="w-20 h-20 rounded-full object-cover"
            />
            <h1 class="w-3/5 text-white text-2xl font-karantina">
                {user?.userName || "Usuário"}
            </h1>
        </div>
    </div>

    <!-- <div class="w-full text-white text-sm">
        {#if user}
            <p>Usuário logado:</p>
            <pre>{JSON.stringify(user, null, 2)}</pre>
        {:else}
            <p>Nenhum usuário logado.</p>
        {/if}
    </div> -->

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

        <div id="ajustes" class="w-full p-4 flex flex-col gap-4 bg-[#D9D9D9] bg-opacity-10 rounded-xl text-2xl text-white">
            <a href="/user/update" class="w-full flex items-center justify-between"><span class="flex gap-2"><IconUser size="28" color="#facc15"/> Perfil </span> <IconChevronRight color="#facc15"/></a>
            <a href="" class="w-full flex items-center justify-between"><span class="flex gap-2"><IconSettings size="28" color="#facc15"/> Configurações </span> <IconChevronRight color="#facc15"/></a>
            <a href="" class="w-full flex items-center justify-between"><span class="flex gap-2"><IconBell size="28" color="#facc15"/> Notificações </span> <IconChevronRight color="#facc15"/></a>
            <a href="" class="w-full flex items-center justify-between"><span class="flex gap-2"><IconHelp size="28" color="#facc15"/> Ajuda </span> <IconChevronRight color="#facc15"/></a>
            <button on:click={logout} class="w-full flex items-center justify-between text-left bg-transparent border-0 outline-none cursor-pointer hover:opacity-80">
                <span class="flex gap-2"><IconLogout size="28" color="#facc15"/> Sair </span>
            </button>
        </div>
    </main>
</section>
