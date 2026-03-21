<template>
    <Page>
        <section class="section">
            <div class="wg-status-outer">
                <h2>wg status</h2>
                <a href="/wg">raw</a>
                <small class="refreshing">refreshing in {{ timeLeft }}s</small>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>hostname</th>
                            <th>addresses</th>
                            <th>last handshake</th>
                            <th>public key</th>
                            <th>rx</th>
                            <th>tx</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ peers.length > 0 ? UP_CHAR : DOWN_CHAR }}</td>
                            <td>trekbak</td>
                            <td>10.0.0.0/24<br>2a01:4f8:c0c:4b0b::/64</td>
                            <td>-</td>
                            <td>BeuSlGVS5CYYc5bHPevXfMnOYZEbO7ntV3z5e+08QE4=</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr v-for="{ pkey, peer } in peers">
                            <td>{{ isUp(peer) ? UP_CHAR : DOWN_CHAR }}</td>
                            <td>{{ findAlias(peer.ips) }}</td>
                            <td>{{ peer.ips.join("\n") }}</td>
                            <td>{{ formatAgo(peer.handshake) }}</td>
                            <td>{{ pkey }}</td>
                            <td>{{ formatTransfer(peer.rx) }}</td>
                            <td>{{ formatTransfer(peer.tx) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
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

td:nth-child(3),
th:nth-child(3) {
    white-space: pre-line;
}

td:nth-child(4),
th:nth-child(4) {
    width: 15%;
    white-space: nowrap;
}

table {
    border-collapse: collapse;
    width: 100%;
}

.table-container {
    overflow-x: scroll;
}

@media (max-width: 640px) {
    .table-container {
        width: calc(100% + 2.3rem);
        margin-left: -1.15rem;
        margin-right: -1.15rem;
    }
}
</style>

<script setup lang="ts">
import Page from '@/components/Page.vue';
import { computed, onMounted, onUnmounted, ref, type Ref } from 'vue';

const WG_PATH = import.meta.env.DEV ? "/wg-backend" : "/wg";
const UP_CHAR = "🟢";
const DOWN_CHAR = "🔴";

interface Peer {
    handshake: number;
    ips: string[];
    rx: number;
    tx: number;
}

const isUp = (peer: Peer) => (Date.now() / 1000 - peer.handshake) <= 60 * 3;

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
};

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
};

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

const formatTransfer = (b: number) => {
    if (b <= 0) return "nothing.";
    
    const exp = Math.max(0, Math.log2(b));
    if (exp >= 30) return (b / (1 << 30)).toFixed(2) + " GiB";
    if (exp >= 20) return (b / (1 << 20)).toFixed(2) + " MiB";
    if (exp >= 10) return (b / (1 << 10)).toFixed(2) + " KiB";
    if (exp >= 8) return (b / (1 << 10)).toFixed(2) + " KiB";
    return b + " B";
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