<script setup lang="ts">
import { io } from 'socket.io-client';

export interface songToPlay {
    title: string,
    url: string
}

interface currentState {
    positionInQueue: number,
    queueSize: number,
    queue: songToPlay[],
    volume: number,
    status: string,
    loopQueue: boolean,
    loopTrack: boolean
}

const socket = io('http://localhost:5000');
const songUrl = ref<string>('');
const channelId = ref<string>('');
const loadingPlay = ref<boolean>(false);

const currentStatus = ref<string>('idle');
const volume = ref<number>(0);
const currentSongName = ref<string | undefined>(undefined);
const positionInQueue = ref<number>(0);
const queue = ref<songToPlay[]>([]);
const queueSize = ref<number>(0);
const paused = ref<boolean>(false);
const loopMode = ref<'disabled' | 'track' | 'queue'>('disabled')
const loopToolTipText = computed(() => {
    if (loopMode.value === 'queue') {
        return 'Loop track'
    } else if (loopMode.value === 'track') {
        return 'Disable loop'
    } else {
        return 'Loop queue'
    }
})

const playButtonEnabled = computed(() => {
    return songUrl.value.length > 10 && channelId.value.length > 5;
})

socket.on('connect', () => {
    console.log(socket.id);
})

socket.on('play-song', (...args: Array<songToPlay>) => {
    console.log(args[0].title);
    currentSongName.value = args[0].title;
})

socket.on('current-state', (...args) => {
    const currentState: currentState = args[0];
    console.log(currentState);
    currentStatus.value = currentState.status;
    paused.value = currentState.status == 'playing' ? false : true;
    queue.value = currentState.queue;
    positionInQueue.value = currentState.positionInQueue;
    queueSize.value = currentState.queueSize;
    volume.value = currentState.volume * 100;
    if (currentState.loopQueue == true) {
        loopMode.value = 'queue';
    } else if (currentState.loopTrack == true) {
        loopMode.value = 'track';
    } else {
        loopMode.value = 'disabled';
    }

})

const togglePause = async () => {
    const option = paused.value ? 'resume' : 'pause'
    await $fetch('http://localhost:5000/voice/' + option, {
        method: 'POST',
        onResponse(response) {
            console.log(response);
        }
    });
}

const playSong = async () => {
    loadingPlay.value = true;
    if (songUrl.value && channelId.value) {
        await $fetch('http://localhost:5000/voice/play/', {
            body: {
                songUrl: songUrl.value,
                channelId: channelId.value
            },
            method: 'POST',
            onResponse(response) {
                console.log(response);
            },
            onResponseError(error) {
                console.log(error);
            }
        })
    } else {
        console.log('You must set an song url and a channel id');
    }
    loadingPlay.value = false;
}

const changeLoop = async () => {
    let newOption: string = '';
    if (loopMode.value === 'queue') {
        newOption = 'track';
    } else if (loopMode.value === 'track') {
        newOption = 'disabled'
    } else {
        newOption = 'queue'
    }
    console.log(newOption);
    if (newOption !== 'disabled') {
        await $fetch('http://localhost:5000/voice/loop', {
            method: 'POST',
            body: {
                option: newOption
            },
            onResponse(response) {
                console.log(response)
            }
        })
    } else {
        await $fetch('http://localhost:5000/voice/disableLoop', {
            method: 'POST', 
            onResponse(response) {
                console.log(response)
            }
        })
    }
}

const skipMusic = async () => {
    await $fetch('http://localhost:5000/voice/skip/', {
        method: 'POST',
        onResponse(response) {
            console.log(response);
        }
    })
}

const backMusic = async () => {
    await $fetch('http://localhost:5000/voice/back/', {
        method: 'POST',
        onResponse(response) {
            console.log(response);
        }
    })
}

</script>

<template>
<div class="flex flex-col h-screen" >
    <header class="basis-[10%] shrink-0">
        <div class="font-inter font-semibold flex items-center text-4xl select-none h-full px-5">
            <h1>IRoll <span class="text-primary">Discord</span></h1>
        </div>
    </header>
    <UDivider />
    <main class="basis-[75%] flex flex-col grow-0 overflow-hidden ">
        <div class="flex flex-col lg:flex-row lg:space-x-3 space-y-3 lg:space-y-0 px-5 my-5">
            <UInput v-model="songUrl" placeholder="Song URL" class="flex-1 lg:w-72" color="gray" />
            <UInput v-model="channelId" placeholder="Channel ID" class="flex-1 lg:w-72" color="gray" />
            <UButton :disabled="!playButtonEnabled" @click="playSong" :loading="loadingPlay" class="px-5 flex justify-center">Add Song</UButton>
        </div>
        <UDivider />
        <div class="overflow-auto bg-gray-950/30 flex-grow">
            <Playlist class="pt-5" :queue="queue" />
        </div>
    </main>
    <UDivider />
    <footer class="basis-[15%] shrink-0 font-inter px-5">
        <div class="flex w-full h-full">
            <div class="basis-[25%] flex flex-col justify-center px-3 overflow-hidden"">
                <div v-if="currentStatus !== 'idle' && queue.length > 0">
                    <div class="font-light w-full">Now Playing:</div>
                    <div class="font-semibold truncate w-full">{{  queue[positionInQueue].title }}</div>
                </div>
                <div v-else>
                    <span class="select-none">No song playing now</span>
                </div>
            </div>
            <div class="basis-[50%] flex items-center justify-center">
                <div class="space-x-3">
                    <UTooltip text="previous">
                        <UButton variant="soft" square :ui="{ rounded: 'rounded-lg' }" :disabled="positionInQueue == 0" @click="backMusic">
                            <Icon name="material-symbols:skip-previous-rounded" class="text-[50px]" />
                        </UButton>
                    </UTooltip>
                    <UTooltip :text="paused ? 'play' : 'pause'">
                        <UButton variant="soft" square :ui="{ rounded: 'rounded-lg' }" @click="togglePause" >
                            <Icon  class="text-[50px]" :name="paused ? 'material-symbols:play-arrow-rounded' : 'material-symbols:pause-rounded'" />
                        </UButton>
                    </UTooltip>
                    <UTooltip text="next">
                        <UButton variant="soft" square :ui="{ rounded: 'rounded-lg' }" 
                        :disabled="positionInQueue + 1 > queueSize || positionInQueue + 1 == queueSize" @click="skipMusic">
                            <Icon name="material-symbols:skip-next-rounded" class="text-[50px]" />
                        </UButton>
                    </UTooltip>
                    <UTooltip :text="loopToolTipText">
                        <UButton variant="link" square :ui="{ rounded: 'rounded-lg' }">
                            <Icon @click="changeLoop"
                            :name="loopMode === 'queue' || loopMode === 'disabled' ? 'material-symbols:repeat-rounded' : 'material-symbols:repeat-one-rounded'" 
                            class="text-[50px]" :class="loopMode === 'disabled' ? 'text-slate-400' : 'text-primary'" />
                        </UButton>
                    </UTooltip>
                </div>
            </div>
            <div class="basis-[25%] flex items-center justify-center">
                <Volume v-model:volume="volume"/>
            </div>
        </div>
    </footer>
</div>
</template>

<style>

</style>