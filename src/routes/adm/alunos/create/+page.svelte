<script>
    import { goto } from "$app/navigation";
    import { IconChevronLeft, IconInputCheck } from "@tabler/icons-svelte";
    import { onMount } from 'svelte';
    import APIService from '/src/services/APIService.js';

    let error = null;
    let name = '';
    let email = '';
    let type = "";
    let password = '';
    let message = '';

    let api = new APIService('http://191.252.195.85:5001/api/auth');

    const handleSubmit = async (event) => {
        event.preventDefault();
        createUser();
    };

    async function createUser() {
        try {
            const data = { username: name, email: email, password: password, type: type };
            console.log("CreateUser: ", data);
            const result = await api.post('/register', data);
            message = 'Usuário criado com sucesso!';
            console.log(result);
        } catch (err) {
            message = 'Erro: ' + err.message;
        }
    };


    async function fetchAlunos() {
        try {
            const response = await fetch('http://191.252.195.85:5001/api/auth/full-users/2');
            if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
            }
            alunos = await response.json();
            console.log(alunos);
        } catch (err) {
            error = err.message;
        }
    }

    onMount(() => {
        fetchAlunos();
    });
</script>

<section class="w-full min-h-screen flex flex-col items-start py-4 px-8 gap-4 bg-[#2c2c2c] font-karantina uppercase">
    <header id="head" class="w-full">
        <div class="flex justify-between">
            <a href="/adm/alunos" class="bg-[#2c2c2c] p-2 rounded-full border border-zinc-600" aria-label="Voltar para o início">
                <IconChevronLeft color="#facc15" />
            </a>
        </div>
    </header>

    <main class="w-full flex flex-col gap-8">
        <div id="exercicios" class="w-full text-white">
            <h2 class="text-4xl mt-4 mb-4">Adicionar Usuário</h2>

            <form on:submit={handleSubmit} class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="name" class="text-2xl">Nome do Usuário</label>
                    <input 
                        type="text" 
                        bind:value={name} 
                        id="name" 
                        class="w-full p-4 rounded-xl bg-[#2c2c2c] text-white" 
                        placeholder="Digite o nome do aluno" 
                        required 
                    />
                </div>
            
                <div class="flex flex-col gap-2">
                    <label for="email" class="text-2xl">E-mail</label>
                    <input 
                        bind:value={email} 
                        type="email"
                        id="email" 
                        class="w-full p-4 rounded-xl bg-[#2c2c2c] text-white" 
                        placeholder="E-mail" 
                        required
                    />
                </div>

                <div
                    class="flex items-center justify-start pl-4 border-2 border-white rounded-full relative"
                >
                    <select 
                        bind:value={type}
                        required
                        class="py-3 px-4 bg-transparent font-semibold text-white outline-none rounded-full appearance-none relative z-10"
                    >
                        <option value="" disabled selected class="text-gray-400 bg-transparent">Tipo de usuário</option> 
                        <option value=2 class="text-black bg-transparent">Aluno</option>
                        <option value=1 class="text-black bg-transparent">Professor</option>
                        <option value=0 class="text-black bg-transparent">Administrador</option>
                    </select>
                </div>
            
                <div class="flex flex-col gap-2">
                    <label for="password" class="text-2xl">Senha</label>
                    <input 
                        type="password" 
                        bind:value={password} 
                        name="password" 
                        class="w-full p-4 rounded-xl bg-[#2c2c2c] text-white" 
                    />
                </div>
            
                <button 
                    type="submit" 
                    class="flex items-center justify-center p-4 rounded-xl bg-[#facc15] text-black mt-4"
                >
                    <IconInputCheck size="32" color="#2c2c2c" />
                    <span class="text-2xl ml-1">Criar</span>
                </button>
            
                {#if message}
                    <p>{message}</p>
                {/if}
            </form>
        </div>
    </main>
</section>
