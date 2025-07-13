<script>
    import { IconChevronLeft } from "@tabler/icons-svelte";
    import avatar from "../../../images/avatar.png";
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let alunos = [];
    let error = null;

    async function fetchAlunos() {
        try {
            const response = await fetch('http://191.252.195.85:5001/api/auth/full-users/2');
            if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
            }
            const data = await response.json();
            alunos = data;
            console.log('Alunos:', alunos);
        } catch (err) {
            error = err.message;
            console.error('Erro ao buscar alunos:', error);
        }
    }

    function handleAlunoClick(aluno) {
        console.log('Aluno selecionado:', aluno);
        sessionStorage.setItem('aluno', JSON.stringify(aluno));
        goto('/adm/alunos/exercises', { state: { aluno }, replaceState: true }); 
    }

    const deleteUser = async (userId) => {  
        console.log("Excluindo usuário com ID:", userId);
        try {
            const response = await fetch(`http://191.252.195.85:5001/api/user/${userId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir aluno.");
            }

            alunos = alunos.filter(user => user.id !== userId);
        } catch (error) {
            console.error("Erro ao excluir aluno:", error);
        }
    };

    onMount(fetchAlunos);
</script>

<section class="w-full min-h-dvh flex flex-col items-start py-4 px-8 gap-8 bg-[#2c2c2c] font-karantina uppercase">
    <div id="head" class="w-full flex justify-between">
        <a href="/adm/home" class="bg-[#2c2c2c] p-2 rounded-full border border-zinc-600">
            <IconChevronLeft color="#facc15" />
        </a>
    </div>

    <main class="w-full flex flex-col gap-8">
        <div id="exercicios" class="w-full flex flex-col gap-4 text-white">
            <div class="w-full flex justify-between items-center mt-4 mb-4">
                <h2 class="text-4xl">Seus Alunos</h2>
                <a href="/adm/alunos/create" class="w-28 flex items-center justify-center px-2 py-3 rounded-xl bg-[#facc15] text-black">
                    <span class="text-xl ml-1">Adicionar</span>
                </a>
            </div>

            {#if error}
                <div class="text-red-500">{error}</div>
            {:else if alunos.length === 0}
                <div class="text-gray-400">Nenhum aluno encontrado.</div>
            {:else}
                {#each alunos as aluno}
                    <div id="card" class="w-full h-28 flex items-center p-4 gap-4 rounded-xl bg-zinc-700" style="background-color: #3f3f46;" on:click={() => handleAlunoClick(aluno)}>
                        <img src={avatar} alt="Avatar" class="h-9 w-9 rounded-full">
                        <div>
                            <h2 class="text-2xl">{aluno.appUser.name}</h2>
                            <span class="text-lg">Visualizar plano de treinos</span>
                        </div>
                    </div>
                    <button id="lixo" type="button" on:click|stopPropagation={() => deleteUser(aluno.appUser.id)}>
                        <img src="/src/images/lixeira.svg" alt="Excluir">
                    </button>                    
                {/each}
            {/if}
        </div>
    </main>
</section>

<style>
    #card {
        margin-bottom: -2.3rem;
    }

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
