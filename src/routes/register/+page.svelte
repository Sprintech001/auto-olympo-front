<script>
    import OlympoYellow from '../../images/olympo-yellow.png';
    import { IconRecordMail, IconUser } from '@tabler/icons-svelte';
    import { IconLock, IconCheck, IconX } from '@tabler/icons-svelte';

    let message = '';
    let username = ''; 
    let email = '';
    let password = '';
    let cpf = ''; 
    let phone = ''; 
    let birthDate = ''; 

    const passwordRequirements = [
        { id: 'length', text: 'Pelo menos 6 caracteres.', isValid: false },
        { id: 'lowercase', text: 'Pelo menos uma letra minúscula (a-z).', isValid: false },
        { id: 'uppercase', text: 'Pelo menos uma letra maiúscula (A-Z).', isValid: false },
        { id: 'special', text: 'Pelo menos um caractere especial (ex.: @, #, $).', isValid: false }
    ];

    const validatePassword = (password) => {
        passwordRequirements.forEach(req => {
            if (req.id === 'length') req.isValid = password.length >= 6;
            if (req.id === 'lowercase') req.isValid = /[a-z]/.test(password);
            if (req.id === 'uppercase') req.isValid = /[A-Z]/.test(password);
            if (req.id === 'special') req.isValid = /[^a-zA-Z0-9]/.test(password);
        });
    };

    $: validatePassword(password); 

    const handleSubmit = async (event) => {
        event.preventDefault();

        const invalidRequirements = passwordRequirements.filter(req => !req.isValid);
        if (invalidRequirements.length > 0) {
            message = 'A senha não atende a todos os requisitos.';
            return;
        }

        const requestBody = {
            username,
            email,
            password,
            Type: 2,
            ...(cpf && { cpf }), 
            ...(phone && { phone }),
            ...(birthDate && { birthDate: new Date(birthDate).toISOString() }) 
        };

        try {
            const response = await fetch("http://191.252.195.85:5001/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                message = '<span class="text-green-500">✅ Usuário criado com sucesso!</span>';
                console.log(await response.json());

                setTimeout(() => {
                    window.location.href = '/login';
                }, 500);
            } else {
                const errorResponse = await response.json();
                message = `<span class="text-red-500">❌ Erro ao criar usuário: ${errorResponse.message || 'Verifique os dados.'}</span>`;
            }
        } catch (err) {
            message = `<span class="text-red-500">❌ Erro: ${err.message}</span>`;
        }
    };
</script>

<section class="w-full min-h-dvh flex flex-col items-start px-8 gap-8 bg-[#2c2c2c]">
    <div class="w-full flex py-8 justify-between">
        <img src={OlympoYellow} alt="Logo Olympo" class="max-w-16">
        <a href="/login" class="text-yellow-400 font-semibold mt-5 mr-3">Entrar</a>
    </div>
    <div id="titles">
        <h2 class="text-3xl text-yellow-400 font-extrabold">Registro</h2>
        <h3 class="text-xl text-white">Bem-vindo(a) a Olympo</h3>
    </div>
    <form on:submit|preventDefault={handleSubmit} class="w-full flex flex-col gap-4">
        <div class="flex items-center justify-start pl-4 border-2 border-white rounded-full">
            <IconUser color="#facc15"/>
            <input 
                type="text" 
                placeholder="Usuário" 
                bind:value={username} 
                class="py-3 px-4 bg-transparent font-semibold text-white outline-none rounded-full">
        </div>
        <div class="flex items-center justify-start pl-4 border-2 border-white rounded-full">
            <IconRecordMail color="#facc15"/>
            <input 
                type="email" 
                placeholder="E-mail" 
                bind:value={email} 
                class="py-3 px-4 bg-transparent font-semibold text-white outline-none rounded-full">
        </div>
        <div class="flex items-center justify-start pl-4 border-2 border-white rounded-full">
            <IconLock color="#facc15"/>
            <input 
                type="password" 
                placeholder="Senha" 
                bind:value={password}
                class="py-3 px-4 bg-transparent font-semibold text-white outline-none rounded-full">
        </div>
        <ul class="text-sm text-white mt-2">
            {#each passwordRequirements as req}
                <li class="flex items-center gap-2">
                    {#if req.isValid}
                        <IconCheck color="green" />
                    {:else}
                        <IconX color="red" />
                    {/if}
                    {req.text}
                </li>
            {/each}
        </ul>
        <div class="w-full flex flex-col pb-16 mt-4">
            <button 
                type="submit" 
                class="px-4 py-3 bg-yellow-400 font-karantina w-full rounded-full tracking-wider text-3xl text-center">
                Salvar
            </button>
        </div>
        {#if message}
            <p class="text-yellow-400 font-semibold text-center" innerHTML={message}></p>
        {/if}
    </form>
</section>
