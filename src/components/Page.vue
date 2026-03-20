<template>
    <div class="layout">
        <SiteHeader />
        <main class="content"><slot></slot></main>
    </div>
</template>

<script setup lang="ts">
import SiteHeader from './SiteHeader.vue';


</script>

<style scoped>
.layout {
    max-width: 1000px;
    margin: auto;
    padding: 2rem 1.25rem;
    background: transparent;
    color: var(--text);
    min-height: 100vh;
    box-sizing: border-box;
}

.content {
    display: flex;
    flex-direction: column;
    gap: 2.4rem;
    margin-top: 1.2rem;
}

@media (max-width: 640px) {
    .layout {
        padding-left: 0;
        padding-right: 0;
    }

    .section {
        border-radius: 0;
        border-left: none;
        border-right: none;
    }
}
</style>