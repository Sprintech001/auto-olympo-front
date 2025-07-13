<script>
    import {
        IconBarbell,
        IconChevronLeft,
        IconInputCheck,
        IconFlame,
    } from "@tabler/icons-svelte";
    import { onMount } from "svelte";
    import { selectedExerciseId } from '../../../../services/storelinks.js';

    let exercises = [];
    let exercise = { id: null, name: '', description: '', imagePath: '', videoPath: "" }; 
    let error = null;
    let message = '';
    let imagePath = null;
    let videoPath = null;
    const serverUrl = 'http://191.252.195.85:5001';

    function adjustHeight(event) {
        const textarea = event.target;
        textarea.style.height = "auto"; 
        textarea.style.height = `${textarea.scrollHeight}px`; 
    }

    function addImage() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            const files = event.target.files;
            if (files && files.length > 0) {
                imagePath = files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    const hero = document.getElementById('hero');
                    hero.style.backgroundImage = `url(${event.target.result})`;
                };
                reader.readAsDataURL(imagePath);
            }
        };
        input.click();
    }

    function addVideo(event) {
        const files = event.target.files;
        if (files && files.length > 0) {
            videoPath = files[0]; 
            const videoPreview = document.getElementById('videoPreview');
            const videoURL = URL.createObjectURL(videoPath);
            videoPreview.src = videoURL;
            videoPreview.load();
            console.log('Vídeo selecionado:', videoPath);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('id', exercise.id);
        formData.append('name', exercise.name);
        formData.append('description', exercise.description);

        if (imagePath) { 
            formData.append('image', imagePath);
        }

        if (videoPath) { 
            formData.append('video', videoPath);
        }

        try {
            const response = await fetch(`http://191.252.195.85:5001/api/exercise/${exercise.id}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                message = 'Exercício atualizado com sucesso!';
                console.log(result);
                setTimeout(() => {
                    window.location.href = '/adm/exercises';
                }, 300);
            } else {
                message = 'Erro ao atualizar exercício.';
                console.log(response);
            }
        } catch (error) {
            message = 'Erro de requisição: ' + error.message;
        }
    };

    async function fetchExercises() {
        try {
            let exerciseId;
            selectedExerciseId.subscribe(value => {
                exerciseId = value;
            });

            if (!exerciseId) {
                throw new Error('ID do exercício não encontrado');
            }

            const response = await fetch(`http://191.252.195.85:5001/api/exercise/${exerciseId}`);
            if (!response.ok) {
                throw new Error(`Erro: ${response.statusText}`);
            }
            exercise = await response.json();
            console.log(exercise);
        } catch (err) {
            error = err.message;
        }
    }

    onMount(() => {
        fetchExercises();

        const textarea = document.getElementById("description");
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`; 
        }
    });
</script>

<section class="w-full min-h-screen flex flex-col items-start py-4 px-8 gap-4 bg-[#2c2c2c] font-karantina uppercase">
    <div on:click={addImage} id="hero"
        class="w-full h-60 flex items-start justify-between p-4 rounded-xl bg-cover bg-top"
        style="background-image: url('http://191.252.195.85:5001/api/Files/{exercise.imagePath}')">
        <a href="/adm/exercises" 
            on:click={(e) => e.stopPropagation()} 
            class="bg-[#2c2c2c] p-2 rounded-full border border-zinc-600"> 
            <IconChevronLeft color="#facc15"/> 
        </a>
    </div>

    <main class="w-full flex flex-col gap-8 py-4 px-8">
        <form on:submit={handleSubmit} class="flex flex-col gap-4">
            <div id="texts" class="w-full flex flex-col items-center justify-center gap-4 text-white">
                <input 
                    class="w-full p-4 rounded-xl bg-[#2c2c2c] text-white text-3xl font-karantina uppercase"
                    type="text" 
                    bind:value={exercise.name} 
                    id="name" 
                    required
                />
                <textarea 
                    id="description" 
                    bind:value={exercise.description} 
                    class="w-full p-4 rounded-xl bg-[#2c2c2c] text-white"
                    on:input={adjustHeight} 
                ></textarea>
            </div>

            <div>
                <label for="videoPath">Execução:</label>
                <input
                    type="file" 
                    id="video" 
                    accept="video/*" 
                    on:change={addVideo}
                >
            </div>

            <video id="videoPreview" width="320" height="240" controls>
                {#if exercise.videoPath}
                    <source src={`${serverUrl}/api/Files/${exercise.videoPath}`} />
                {/if}
                <track kind="captions" src="path/to/captions.vtt" srclang="en" label="English">
                Seu navegador não suporta o elemento de vídeo.
            </video>
            <p>{serverUrl}/api/Files/{exercise.videoPath}</p>
    
            <div id="info" class="w-full flex flex-wrap items-center justify-between text-white text-md mt-10">
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
                type="submit" 
                class="flex items-center justify-center p-4 rounded-xl bg-[#facc15] text-black mt-4"
            >
                <IconInputCheck size="32" color="#2c2c2c" />
                <span class="text-2xl ml-1">Atualizar</span>
            </button>
        </form>
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
