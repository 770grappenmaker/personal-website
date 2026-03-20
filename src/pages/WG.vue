<template>
    <Page>
        <section class="section">
            <div class="wg-status-outer">
                <h2>wg status</h2>
                <a href="/wg">raw</a>
                <small class="refreshing">refreshing in {{ timeLeft }}s</small>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>hostname</th>
                        <th>addresses</th>
                        <th>last handshake</th>
                        <th>public key</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="{ pkey, peer } in peers">
                        <td>{{ findAlias(peer.ips) }}</td>
                        <td>{{ peer.ips.join(", ") }}</td>
                        <td>{{ formatAgo(peer.handshake) }}</td>
                        <td>{{ pkey }}</td>
                    </tr>
                </tbody>
            </table>
        </section>
    </Page>
</template>

<style>
.layout {
    max-width: unset !important;
}
</style>

<style scoped>
.wg-status-outer {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: .5rem;
    gap: 10px;
}

.wg-status-outer h2 {
    flex-grow: 1;
    margin-bottom: 0;
}

.refreshing {
    opacity: .75;
}

th {
    text-align: left;
}

tbody tr:nth-child(odd) {
    background: rgba(0, 0, 0, .3);
}

td,
th {
    padding: 8px;
}

td:nth-child(3), th:nth-child(3) {
    width: 20%;
}

table {
    border-collapse: collapse;
    width: 100%;
}
</style>

<script setup lang="ts">
import Page from '@/components/Page.vue';
import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue';

const WG_PATH = import.meta.env.DEV ? "/wg-backend" : "/wg";

interface Peer {
    handshake: number;
    ips: string[];
}

interface Response {
    peers: Record<string, Peer>;
    last_update: number;
}

const data: Ref<Response> = ref({ peers: {}, last_update: 0 });
const peers = computed(() => {
    const peers = data.value.peers;
    return Object.keys(peers)
        //@ts-expect-error
        .sort((a, b) => peers[a].ips[0].localeCompare(peers[b].ips[0]))
        .map(x => ({ pkey: x, peer: peers[x] as Peer }));
});

const lastFetched = ref(0);
const TIMEOUT = 10000;
const timeLeft = ref("0");

const aliases = new Map<string, string>();
const findAlias = (ips: string[]) => {
    const match = ips.find(x => aliases.has(x));
    return match ? aliases.get(match) : "";
}

const fetchWireguard = () => {
    lastFetched.value = Date.now();
    fetch(WG_PATH)
        .then(x => x.json())
        .then(x => data.value = x)
        .then(_ => lastFetched.value = Date.now());
};

const displayFixed = (int: number, width: number) => {
    const repr = int.toFixed(0);
    const spacing = "\xa0".repeat(Math.max(0, width - repr.length));
    return spacing + repr;
}

const formatAgo = (ts: number) => {
    const tss = Math.round(Date.now() / 1000 - ts);
    let left = tss;

    const seconds = left % 60;
    left = Math.floor(left / 60);

    const minutes = left % 60;
    left = Math.floor(left / 60);

    const hours = left % 24;
    const days = Math.floor(left / 24);

    const res = [];
    if (days > 0) res.push(`${days} day` + (days == 1 ? "" : "s"));
    if (hours > 0) res.push(`${hours} hour` + (hours == 1 ? "" : "s"));
    if (minutes > 0 && res.length < 2) res.push(`${minutes} minute` + (minutes == 1 ? "" : "s"));
    if (seconds > 0 && res.length < 2) res.push(`${seconds} second` + (seconds == 1 ? "" : "s"));
    return res.length > 0 ? res.join(", ") : "now";
};

let timer: number | undefined;

const update = () => {
    const msLeft = TIMEOUT - (Date.now() - lastFetched.value);
    timeLeft.value = displayFixed(Math.ceil(Math.max(0, msLeft) / 1000), 2);
    if (msLeft < 0) fetchWireguard();
};

onMounted(() => {
    timer = setInterval(() => {
        update();
    }, 500);

    update();
    fetch("/pnet").then(x => x.bytes()).then(x => {
        const text = new TextDecoder().decode(x);
        text.split(/\r?\n/).forEach(line => {
            const parts = line.split(" == ");
            if (parts.length != 2) return;

            aliases.set(parts[0] as string, parts[1] as string);
        });
    });
});

onUnmounted(() => clearInterval(timer));
</script>