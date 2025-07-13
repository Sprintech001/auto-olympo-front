<script>
    import { onMount } from 'svelte';
    import { userSession } from '/src/services/storelinks.js'; 
    import { get } from 'svelte/store';
    import { goto } from '$app/navigation';
    import { IconChevronLeft } from '@tabler/icons-svelte';
    import Avatar from '../../../images/avatar.png';

    let user = { cpf: '', name: '', email: '', phone: '', birthDate: '', image: null, imagePath: '' };
    let isLoading = false;
    let error = '';

    const fetchUser = async () => {
        try {
            isLoading = true;
            const loggedUser = get(userSession);
            if (!loggedUser || !loggedUser.token) {
                error = 'Usuário não autenticado.';
                goto('/login'); 
                return;
            }

            user = loggedUser;
            console.log('01 - Dados  do usuário  logado:', user.fullUserData.userData.id);

        } catch (err) {
            console.error(err);
            error = 'Erro ao carregar informações do usuário.';
        } finally {
            isLoading = false;
        }
    };

    const uploadImage = async (imageFile) => {
        const loggedUser = get(userSession);
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadResponse = await fetch('http://191.252.195.85:5001/api/user/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${loggedUser.token}`
            },
            body: formData
        });

        if (!uploadResponse.ok) {
            throw new Error('Erro ao fazer upload da imagem.');
        }

        const uploadResult = await uploadResponse.json();
        return uploadResult.filePath; 
    };

    const updateUser = async () => {
        try {
            if (!user.name || !user.email || !user.cpf) {
                error = 'Por favor, preencha todos os campos obrigatórios.';
                return;
            }

            isLoading = true;
            const loggedUser = get(userSession);
            if (!loggedUser || !loggedUser.token) {
                error = 'Usuário não autenticado.';
                goto('/login'); 
                return;
            }

            // Upload da imagem, se houver
            if (user.image) {
                const uploadedPath = await uploadImage(user.image);
                user.imagePath = uploadedPath;
            }

            const userUpdatePayload = { 
                identityId: loggedUser.id, 
                userName: user.name, 
                email: user.email,
                password: user.password || null, 
                cpf: user.cpf,
                phone: user.phone,
                birthDate: user.birthDate 
                    ? new Date(user.birthDate).toISOString().split('T')[0] 
                    : null,
                imagePath: user.imagePath || null  
            };

            const userResponse = await fetch(`http://191.252.195.85:5001/api/auth/update/${user.fullUserData.userData.id}`, { 
                method: 'PUT',
                headers: 
                {
                    'Authorization': `Bearer ${loggedUser.token}`,
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(userUpdatePayload)
            });

            if (!userResponse.ok) throw new Error('Erro ao atualizar informações do usuário.');

            alert('Informações atualizadas com sucesso!');
            fetchUser(); 

        } catch (err) {
            console.error(err);
            error = err.message || 'Erro ao atualizar informações do usuário.';
        } finally {
            isLoading = false;
        }
    };

    $: user;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            user.image = file;
        }
    };

    onMount(fetchUser);
</script>

<section class="w-full min-h-dvh flex flex-col items-center py-4 px-8 gap-8 bg-[#2c2c2c] font-karantina uppercase">
    <div class="w-full flex justify-between">
        <a href="/user" class="bg-[#2c2c2c] p-2 rounded-full border border-zinc-600"> <IconChevronLeft color="#facc15"/> </a>
    </div>

    <div class="w-full flex flex-col gap-4 items-center text-center">
        <img src={Avatar} alt="Avatar" class="w-20 h-20 rounded-full" />
        <h1 class="w-3/5 text-white text-2xl font-karantina">
            {user?.name || "Usuário"}
        </h1>
        <h1 class="text-2xl text-white">Atualizar Informações</h1>
    </div>

    {#if isLoading}
        <p>Carregando...</p>
    {:else}
        <form on:submit|preventDefault={updateUser} class="w-full max-w-md flex flex-col gap-3 bg-gray-800 p-6 rounded shadow-md">
            <div class="flex flex-col gap-2">
                <label for="cpf" class="text-white">CPF:</label>
                <input id="cpf" type="text" bind:value={user.cpf} class="p-2 rounded border" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="name" class="text-white">Nome:</label>
                <input id="name" type="text" bind:value={user.name} class="p-2 rounded border" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="email" class="text-white">Email:</label>
                <input id="email" type="email" bind:value={user.email} class="p-2 rounded border" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="phone" class="text-white">Telefone:</label>
                <input id="phone" type="text" bind:value={user.phone} class="p-2 rounded border" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="birthDate" class="text-white">Data de Nascimento:</label>
                <input id="birthDate" type="date" bind:value={user.birthDate} class="p-2 rounded border" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="password" class="text-white">Senha:</label>
                <input id="password" type="password" bind:value={user.password} class="p-2 rounded border" />
            </div>

            <div class="flex flex-col gap-2">
                <label for="image" class="text-white">Imagem:</label>
                <input id="image" type="file" accept="image/*" on:change={handleImageChange} class="p-2 rounded border" />
            </div>            

            {#if error}
                <p class="text-red-500">{error}</p>
            {/if}

            <button type="submit" class="px-4 py-2 bg-[#facc15] text-black rounded shadow">Salvar</button>
        </form>
    {/if}
</section>

<style scoped>
    form {
        background-color: #2c2c2c;
        padding: 20px;
        border-radius: 8px;
        color: white;
    }

    label {
        font-size: 1.2rem;
        margin-bottom: 5px;
    }

    input {
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #ccc;
        width: 100%;
        color: black;
    }

    button {
        margin-top: 10px;
        cursor: pointer;
    }

    img {
        margin-bottom: 20px;
    }
</style>
