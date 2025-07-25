import { writable, get } from 'svelte/store';

export const selectedExerciseId = writable(null);

export const exercisesStore = writable([]);

export const sessionStore = writable([]);

export const previousRoute = writable(null);


function createUserSessionStore() {
    let initial = null;
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('userSession');
        if (saved) {
            try {
                initial = JSON.parse(saved);
            } catch {}
        }
    }
    const store = writable(initial);
    store.subscribe(value => {
        if (typeof window !== 'undefined') {
            if (value) {
                localStorage.setItem('userSession', JSON.stringify(value));
            } else {
                localStorage.removeItem('userSession');
            }
        }
    });
    return store;
}

export const userSession = createUserSessionStore();

export function setSelectedExercise(id) {
    selectedExerciseId.set(id);
}

export function setPreviousRoute(route) {
    previousRoute.set(route);
}

export function addExercise(exercise) {
    exercisesStore.update(exercises => [...exercises, exercise]);
}

export function removeExercise(id) {
    exercisesStore.update(exercises => exercises.filter(ex => ex.id !== id));
}

export function setUserSession(userData) {
    userSession.set({
        id: userData.id,
        token: userData.token,
        userName: userData.userName,
        email: userData.email,
        name: userData.name,
        birthDate: userData.birthDate,
        cpf: userData.cpf,
        phone: userData.phone,
        type: userData.type,
        message: userData.message,
        imagePath: userData.imagePath,
        image: userData.image,
        fullUserData: userData.fullUserData
    });
}

export function clearUserSession() {
    userSession.set(null);
}

export async function fetchUserData() {
    const loggedUser = get(userSession);
    if (!loggedUser || !loggedUser.token) {
        throw new Error("Usuário não autenticado. Token ausente.");
    }

    const response = await fetch(`http://191.252.195.85:5001/api/auth/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${loggedUser.token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Erro ao buscar dados do usuário.");
    }

    const data = await response.json();

    userSession.set({
        token: loggedUser.token,
        identityData: data.IdentityData,
        userData: data.UserData,
        imagePath: data.UserData?.imagePath || data.UserData?.image || null,
        image: data.UserData?.image || null
    });

    return data;
}

