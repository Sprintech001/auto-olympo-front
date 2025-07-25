<script>
    import { IconChevronLeft, IconInputCheck } from "@tabler/icons-svelte";
    import { onMount } from 'svelte';

    let exercises = [];
    let error = null;
    let name = '';
    let description = '';
    let imagePath = null;  
    let message = '';

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        
        if (imagePath) {
            formData.append('image', imagePath[0]);  
        }

        try {
            const response = await fetch('http://191.252.195.85:5001/api/exercise', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                message = 'Exercício criado com sucesso!';
                console.log(result);
            } else {
                message = 'Erro ao criar exercício.';
            }
        } catch (error) {
            message = 'Erro de requisição: ' + error.message;
        }
    };

    async function fetchExercises() {
        try {
            const response = await fetch('http://191.252.195.85:5001/api/exercise');
            if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
            }
            exercises = await response.json();
            console.log(exercises);
        } catch (err) {
            error = err.message;
        }
    }

    onMount(() => {
        fetchExercises();
    });
</script>

<section class="w-full min-h-screen flex flex-col items-start py-4 px-8 gap-4 bg-[#2c2c2c] font-karantina uppercase">
    <header id="head" class="w-full">
        <div class="flex justify-between">
            <a href="/adm/exercises" class="bg-[#2c2c2c] p-2 rounded-full border border-zinc-600" aria-label="Voltar para o início">
                <IconChevronLeft color="#facc15" />
            </a>
        </div>
    </header>

    <main class="w-full flex flex-col gap-8">
        <div id="exercicios" class="w-full text-white">
            <h2 class="text-4xl mt-4 mb-4">Criar Exercícios</h2>

            <form on:submit={handleSubmit} class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="name" class="text-2xl">Nome do exercício</label>
                    <input 
                        type="text" 
                        bind:value={name} 
                        id="name" 
                        class="w-full p-4 rounded-xl bg-[#2c2c2c] text-white" 
                        placeholder="Digite o nome do exercício" 
                        required 
                    />
                </div>
            
                <div class="flex flex-col gap-2">
                    <label for="description" class="text-2xl">Descrição</label>
                    <textarea 
                        bind:value={description} 
                        id="description" 
                        class="w-full p-4 rounded-xl bg-[#2c2c2c] text-white" 
                        placeholder="Descreva o exercício" 
                        rows="4" 
                        required
                    ></textarea>
                </div>
            
                <div class="flex flex-col gap-2">
                    <label for="image" class="text-2xl">Imagem</label>
                    <input 
                        type="file" 
                        bind:files={imagePath} 
                        id="image" 
                        name="imagePath" 
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
