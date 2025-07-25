<script>
    import OlympoYellow from "../../images/olympo-yellow.png";
    import { IconUser, IconLock } from "@tabler/icons-svelte";
    import { setUserSession } from "../../services/storelinks"; 
    import { goto } from "$app/navigation"; 

    let username = ""; 
    let password = "";
    let error = null;

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                "http://191.252.195.85:5001/api/auth/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                }
            );

            if (response.ok) {
                const data = await response.json(); 
                console.log("Login realizado com sucesso!", data);

                setUserSession({
                    id: data.user.identityData.id,         
                    token: data.token,
                    userName: data.user.identityData.userName, 
                    email: data.user.identityData.email,
                    name: data.user.userData.name,
                    birthDate: data.user.userData.birthDate,
                    cpf: data.user.userData.cpf,
                    phone: data.user.userData.phone,
                    type: data.user.userData.type,
                    message: data.message, 
                    fullUserData: data.user 
                });

                if (data.user.userData.type === "Administrador") {
                    goto("/adm/home");
                    return;
                } else if (data.user.userData.type === "Professor") {
                    goto("/adm/home");
                    return;
                } else if (data.user.userData.type === "Aluno") {
                    goto("/home");
                    return;
                }
            } else {
                error = "Usuário ou senha inválidos.";
            }
        } catch (err) {
            error = "Erro de requisição: " + err.message;
        }
    };
</script>

<section
    class="w-full min-h-dvh flex flex-col items-start px-8 gap-8 bg-[#2c2c2c]"
>
    <div class="w-full flex py-8 justify-between">
        <img src={OlympoYellow} alt="Logo Olympo" class="max-w-16" />
        <a href="/register" class="text-yellow-400 font-semibold mt-5 mr-3"
            >Criar conta</a
        >
    </div>
    <div id="titles">
        <h2 class="text-3xl text-yellow-400 font-extrabold">Login</h2>
        <h3 class="text-xl text-white">Bem-vindo(a) de volta!</h3>
    </div>
    <form on:submit={handleSubmit} class="w-full flex flex-col gap-4">
        <div
            class="flex items-center justify-start pl-4 border-2 border-white rounded-full"
        >
            <IconUser color="#facc15" />
            <input
                type="text"
                bind:value={username}
                placeholder="Usuário"
                class="py-3 px-4 bg-transparent font-semibold text-white outline-none rounded-full"
            />
        </div>
        <div
            class="flex items-center justify-start pl-4 border-2 border-white rounded-full"
        >
            <IconLock color="#facc15" />
            <input
                type="password"
                bind:value={password}
                placeholder="Senha"
                class="py-3 px-4 bg-transparent font-semibold text-white outline-none rounded-full"
            />
        </div>
        <button
            type="submit"
            class="px-4 py-3 bg-yellow-400 font-karantina w-full rounded-full tracking-wider text-3xl text-center"
        >
            ENTRAR
        </button>
        {#if error}
            <p class="text-red-500 font-semibold">{error}</p>
        {/if}
    </form>
</section>
