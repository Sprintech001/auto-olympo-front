<script>
    import { onMount } from 'svelte';
    import { sessionStore } from '/src/services/storelinks.js';
    import { get } from 'svelte/store';
    import { IconChevronLeft } from '@tabler/icons-svelte';
    import { goto } from '$app/navigation';

    let userId;
    let exerciseId;
    let filteredSessions = [];
    let isLoading = false;
    let error = '';
    let emptyMessage = '';
    let exercises = [];

    const dayNames = {
        0: 'Domingo',
        1: 'Segunda-feira',
        2: 'Terça-feira',
        3: 'Quarta-feira',
        4: 'Quinta-feira',
        5: 'Sexta-feira',
        6: 'Sábado',
    };

    const getSessionsByUser = async (userId) => {
        try {
            const response = await fetch(`http://191.252.195.85:5001/api/userexercise/session/${userId}`);

            if (!response.ok) {
                if (response.status === 404) return [];
                throw new Error(`Erro ao buscar sessões do usuário ${userId}`);
            }

            const data = await response.json();
            return data ?? [];
        } catch (err) {
            console.error("Erro ao buscar sessões específicas:", err);
            error = "Erro ao carregar sessões.";
            return [];
        }
    };

    const updateSession = async (sessionData) => {
        try {
            const formData = {
                Id: sessionData.id,
                Day: typeof sessionData.day !== 'undefined' && sessionData.day !== null ? +sessionData.day : +sessionData.originalDay,
                Time: typeof sessionData.time !== 'undefined' && sessionData.time !== null ? sessionData.time : sessionData.originalTime,
                Series: typeof sessionData.series !== 'undefined' && sessionData.series !== null ? sessionData.series : sessionData.originalSeries,
                Repetitions: typeof sessionData.repetitions !== 'undefined' && sessionData.repetitions !== null ? sessionData.repetitions : sessionData.originalRepetitions,
                Breaks: typeof sessionData.breaks !== 'undefined' && sessionData.breaks !== null ? sessionData.breaks : sessionData.originalBreaks,
                ExerciseId: sessionData.exercise?.id || sessionData.exerciseId,
                UserId: sessionData.user?.id || sessionData.userId
            };

            console.log('Atualizando sessão com os dados:', formData);

            const response = await fetch(`http://191.252.195.85:5001/api/session/${sessionData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Erro ao atualizar sessão ${sessionData.id}: ${response.statusText}`);
            }

            let updatedSession = null;
            if (response.status !== 204) { 
                updatedSession = await response.json();
                console.log('Sessão atualizada com sucesso:', updatedSession);

                const sessions = await getSessionsByUser(formData.UserId);
                filteredSessions = sessions.map(s => ({
                    ...s,
                    time: s.time ?? "",
                    series: s.series ?? "",
                    repetitions: s.repetitions ?? "",
                    breaks: s.breaks ?? ""
                }));
            } else {
                console.log('Sessão atualizada com sucesso, mas sem corpo na resposta.');
                const sessions = await getSessionsByUser(formData.UserId);
                filteredSessions = sessions.map(s => ({
                    ...s,
                    time: s.time ?? "",
                    series: s.series ?? "",
                    repetitions: s.repetitions ?? "",
                    breaks: s.breaks ?? ""
                }));
            }
        } catch (err) {
            console.error("Erro ao atualizar sessão:", err);
        }
    };

    const deleteSession = async (sessionId) => {
        try {
            console.log(`Tentando deletar a sessão com ID: ${sessionId}`);
            const response = await fetch(`http://191.252.195.85:5001/api/session/${sessionId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                console.log(`Sessão com ID ${sessionId} deletada com sucesso.`);
                filteredSessions = filteredSessions.filter(s => s.id !== sessionId);
            } else {
                console.error(`Erro ao deletar sessão com ID ${sessionId}: ${response.statusText}`);
            }
        } catch (err) {
            console.error(`Erro ao deletar sessão com ID ${sessionId}:`, err);
        }
    };

    onMount(async () => {
        const storeData = get(sessionStore);
        console.log('storeData:', storeData);

        const navigationState = history.state;

        console.log('storeData:', storeData);
        console.log('navigationState:', navigationState);

        userId = storeData?.userId || navigationState?.userId;
        exerciseId = storeData?.exerciseId || navigationState?.exerciseId;

        if (userId && exerciseId) {
            isLoading = true;
            const sessions = await getSessionsByUser(userId);
            filteredSessions = sessions.map(s => ({
                ...s,
                time: s.time ?? "",
                series: s.series ?? "",
                repetitions: s.repetitions ?? "",
                breaks: s.breaks ?? ""
            }));
            isLoading = false;
        } else {
            error = 'Usuário ou exercício não definidos.';
            console.warn("userId ou exerciseId não estão disponíveis.");
        }
    });

</script>

<section class="w-full min-h-dvh flex flex-col items-start py-4 px-8 gap-8 bg-[#2c2c2c] font-karantina uppercase">
    <div id="head" class="w-full flex justify-between">
        <a href="/adm/alunos/exercises" class="bg-[#2c2c2c] p-2 rounded-full border border-zinc-600">
            <IconChevronLeft color="#facc15" />
        </a>
    </div>
    <main class="w-full flex flex-col gap-2">
        {#if isLoading}
            <p>Carregando sessões...</p>
        {:else if filteredSessions.length === 0}
            <p class="text-white">Nenhuma sessão cadastrada para este exercício.</p>
        {:else}
            {#each filteredSessions as session}
                <div class="flex flex-col gap-2 mb-4 ">
                    <h2 class="text-lg font-bold">Sessão: {session.exercise?.name || "Sem nome de exercício"} - {dayNames[session.day] ?? " "}</h2>
                    <p class="text-sm text-gray-500">Preencha os campos abaixo para editar a sessão.</p>
                </div>

                <form on:submit|preventDefault={() => updateSession(session)} class="mt-0 flex flex-col gap-4 border p-4 rounded shadow-md mb-4">
                    <input type="hidden" value={session.id} />

                    <!-- <pre class="bg-zinc-900 text-yellow-400 p-2 rounded text-xs mb-2">{JSON.stringify(session, null, 2)}</pre> -->

                    <div class="flex flex-col gap-2">
                        <label for={`dia-select-${session.id}`}>Dia da semana:</label>
                        <select
                            id={`dia-select-${session.id}`}
                            bind:value={session.day}
                            class="border p-2 rounded"
                            on:change={(e) => session.day = +e.target.value}
                        >
                            {#each Object.entries(dayNames) as [num, name]}
                                <option value={num}>{name}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for={`tempo-${session.id}`}>Tempo de sessões:</label>
                        <input id={`tempo-${session.id}`} type="text" bind:value={session.time} class="border p-2 rounded" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for={`series-${session.id}`}>Quantidade de Séries:</label>
                        <textarea id={`series-${session.id}`} type="text" bind:value={session.series} class="border p-2 rounded"></textarea>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for={`repeticoes-${session.id}`}>Quantidade de repetições:</label>
                        <input id={`repeticoes-${session.id}`} type="text" bind:value={session.repetitions} class="border p-2 rounded" />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for={`intervalos-${session.id}`}>Tempo de intervalos:</label>
                        <input id={`intervalos-${session.id}`} type="text" bind:value={session.breaks} class="border p-2 rounded" />
                    </div>

                    <div class="flex justify-between mt-4">
                        <button type="submit" class="px-4 py-2 bg-[#facc15] text-black rounded shadow">Salvar</button>
                        <button type="button" on:click={() => deleteSession(session.id)} class="px-4 py-2 bg-red-500 text-white rounded shadow">Deletar</button>
                    </div>
                </form>
            {/each}
        {/if}
    </main>
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

    input, textarea, select {
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #ccc;
        width: 100%;
        color: black;
    }

    input::placeholder {
        color: rgb(213, 29, 29); 
        font-style: italic; 
        opacity: 0.7; 
    }

    button {
        margin-top: 10px;
        cursor: pointer;
    }
</style>
