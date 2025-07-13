<script>
    import {
        IconPlayerPlay,
        IconPlayerPause,
    } from "@tabler/icons-svelte";
    import { onMount } from "svelte";

    let video;
    let currentTime = 0;
    let isPaused = true;
    let timer = 60;
    let interval;
    let exercise = { id: null, name: '', description: '', imagePath: '', videoPath: '' };

    function togglePlayPause() {
        if (video && video.paused) {
            video.play().then(() => {
                isPaused = false;
                startTimer();
            }).catch(error => {
                console.error('Erro ao reproduzir o vídeo:', error);
            });
        } else if (video) {
            video.pause();
            isPaused = true;
            clearInterval(interval);
        }
    }

    function updateTime() {
        if (video) {
            currentTime = video.currentTime;
        }
    }

    function startTimer() {
        clearInterval(interval);
        interval = setInterval(() => {
            if (timer > 0) {
                timer--;
            } else {
                clearInterval(interval);
            }
        }, 1000);
    }

    onMount(() => {
        video = document.getElementById("videoPreview");
        if (video) {
            video.addEventListener("timeupdate", updateTime);
        }

        const selectedExercise = JSON.parse(sessionStorage.getItem('selectedExercise'));
        if (selectedExercise) {
            exercise = selectedExercise;
        }
    });
</script>

<section class="w-full min-h-dvh flex flex-col items-start gap-4 bg-[#2c2c2c]">
    <div class="timer-container">
        <!-- Exibição do timer -->
        <svg class="timer" viewBox="0 0 36 36">
            <path
                class="circle-bg"
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
                class="circle"
                stroke-dasharray="{(timer / 60) * 100}, 100"
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                style="transition: stroke-dasharray 1s linear;"
            />
            <text x="18" y="20.35" class="percentage">{Math.floor(timer / 60)}:{Math.floor(timer % 60).toString().padStart(2, '0')}</text>
        </svg>
        <div class="exercise-name">
            <span>{exercise.name}</span>
        </div>
    </div>

    <video id="videoPreview" width="320" height="240" controls>
        {#if exercise.videoPath}
            <source src={`http://191.252.195.85:5001/api/Files/${exercise.videoPath}`} />
            <track
                kind="captions"
                src="path/to/captions.vtt"
                srclang="en"
                label="English"
            />
        {:else}
            Seu navegador não suporta o elemento de vídeo.
        {/if}
    </video>

    <!-- Controles de reprodução -->
    <div class="controls">
        <div class="controls-buttons">
            <div class="info">
                <span>Tempo</span>
                <span>20 MIN</span>
            </div>
            <button on:click={togglePlayPause}>
                {#if isPaused}
                    <IconPlayerPlay size={30} />
                {:else}
                    <IconPlayerPause size={30} />
                {/if}
            </button>
            <div class="info">
                <span>Musc</span>
                <span>Pernas</span>
            </div>
        </div>
    </div>
</section>


<style>
    section {
        height: 100vh;
        background-color: transparent;
        overflow: hidden;
    }

    video {
        width: 100vw;
        height: 100vh;
        object-fit: cover;
    }

    video::-webkit-media-controls {
        display: none;
    }

    .timer-container {
        position: absolute;
        top: 20px;
        left: 20px; 
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }

    .timer {
        width: 100px; 
        height: 100px; 
    }

    .circle-bg {
        fill: none;
        stroke: #eee;
        stroke-width: 3.8;
    }

    .circle {
        fill: none;
        stroke: #ffdd00;
        stroke-width: 2.8;
        stroke-linecap: round;
        animation: progress 1s ease-out forwards;
    }

    .percentage {
        fill: white;
        font-size: 0.6rem; 
        text-anchor: middle;
    }

    @keyframes progress {
        0% {
            stroke-dasharray: 0 100;
        }
    }

    .exercise-name {
        color: white;
        font-size: 1.5rem;
    }

    .controls {
        width: 100%;
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 10px;
        border-radius: 5px;
    }

    .controls button {
        background-color: #ffcc00;
        color: #2e2e2e;
        border: none;
        padding: 10px;
        border-radius: 50%;
        cursor: pointer;
        width: 5rem;
        height: 5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .controls span {
        color: white;
        font-size: 3rem;
    }

    .controls-buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        width: 100%;
    }

    .info {
        display: flex;
        flex-direction: column;
        background-color: #2e2e2e;  
        width: 6.5rem;
        padding: 10px;
        border-radius: 5px;
        font-weight: 300;
    }

    .info span {
        font-size: 1rem;
        text-align: center;
    }
</style>
