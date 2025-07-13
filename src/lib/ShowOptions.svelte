<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let exerciseId;
    export let userId;

    let days = [
        { name: 'Segunda-feira', checked: false },
        { name: 'Terça-feira', checked: false },
        { name: 'Quarta-feira', checked: false },
        { name: 'Quinta-feira', checked: false },
        { name: 'Sexta-feira', checked: false },
        { name: 'Sábado', checked: false },
        { name: 'Domingo', checked: false }
    ];

    let sessionTime = '';
    let repetitions = '';
    let intervalTime = '';
    let session = '';
    let message = '';

    const dayMapping = {
        'Domingo': 0,
        'Segunda-feira': 1,
        'Terça-feira': 2,
        'Quarta-feira': 3,
        'Quinta-feira': 4,
        'Sexta-feira': 5,
        'Sábado': 6,
    };

    const createSession = async (day) => {
        try {
            const formData = {
                Repetitions: parseInt(repetitions),
                Series: parseInt(session),
                Breaks: parseFloat(intervalTime),
                Time: parseFloat(sessionTime),
                ExerciseId: exerciseId,
                userId: userId,
                Day: dayMapping[day.name],
            };

            const response = await fetch(`http://191.252.195.85:5001/api/session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Erro ao criar sessão para ${day.name}`);
            }

            const responseData = await response.json();
            if (responseData.id) {
                return responseData.id;
            } else {
                throw new Error(`Sessão para ${day.name} não criada corretamente.`);
            }
        } catch (error) {
            console.error(`Erro na criação da sessão para ${day.name}:`, error);
            throw error;
        }
    };

    const createSessionsForSelectedDays = async () => {
        const selectedDays = days.filter(day => day.checked);
        const sessionIds = [];

        for (let day of selectedDays) {
            const sessionId = await createSession(day);
            if (!sessionIds.includes(sessionId)) {
                sessionIds.push(sessionId);
            }
        }

        return sessionIds;
    };

    async function handleSubmit() {
        try {
            const createdSessionIds = await createSessionsForSelectedDays();
            console.log('Sessões criadas com sucesso:', createdSessionIds);
            message = 'Sessões criadas com sucesso!';
            dispatch('sessionsCreated', { sessionIds: createdSessionIds });
            
            sessionTime = '';
            repetitions = '';
            intervalTime = '';
            session = '';
            days = days.map(day => ({ ...day, checked: false }));
        } catch (err) {
            message = 'Erro ao criar sessões. Verifique os dados e tente novamente.';
        }
    }
</script>

<div class="form-container">
    <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
            <label>Dias de execução:</label>
            <div class="checkbox-container">
                {#each days as day}
                    <label class="checkbox-item">
                        <input type="checkbox" bind:checked={day.checked} />
                        {day.name}
                    </label>
                {/each}
            </div>
        </div>

        <div class="flex flex-col gap-2">
            <label>Tempo de sessões (minutos):</label>
            <input type="number" bind:value={sessionTime} min="1" required />
        </div>

        <div class="flex flex-col gap-2">
            <label>Quantidade de Sessões:</label>
            <input type="number" bind:value={session} min="1" required />
        </div>

        <div class="flex flex-col gap-2">
            <label>Quantidade de repetições:</label>
            <input type="number" bind:value={repetitions} min="1" required />
        </div>

        <div class="flex flex-col gap-2">
            <label>Tempo de intervalos (minutos):</label>
            <input type="number" bind:value={intervalTime} min="1" required />
        </div>

        <button type="submit" class="px-4 py-2 bg-[#facc15] text-black rounded">Salvar</button>
        {#if message}
            <p class="text-white">{message}</p>
        {/if}
    </form>
</div>

<style>
    .form-container {
        background-color: #1a1a1a;
        padding: 1.5rem;
        border-radius: 0.5rem;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .checkbox-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .checkbox-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    input[type="number"], input[type="checkbox"] {
        background-color: transparent;
        color: white;
        border: 1px solid white;
        padding: 0.5rem;
        border-radius: 0.25rem;
    }

    input[type="number"]::placeholder {
        color: white;
    }

    input[type="checkbox"]:checked {
        background-color: #facc15;
        border-color: #facc15;
    }

    label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    button {
        cursor: pointer;
    }
</style>
