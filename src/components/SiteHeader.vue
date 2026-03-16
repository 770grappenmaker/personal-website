<template>
  <header class="header">
    <div class="identity">
      <h1 class="name">Koen Oostveen</h1>
      <span class="tagline">Kotlin enthusiast - Student @ University of Twente</span>
    </div>
    <nav class="nav">
      <Button as="a" href="/cv.pdf" label="cv" text />
      <Button as="a" href="https://webmail.koenoostveen.nl" label="wm" text />
      <Button as="a" href="https://files.koenoostveen.nl" label="fs" text />
      <Button as="a" href="https://github.com/770grappenmaker" label="gh" text />
    </nav>
  </header>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  margin-bottom: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(8, 19, 38, 0.28);
}

.identity {
  display: flex;
  flex-direction: column;
}

.name {
  margin: 0;
  color: var(--text);
}

.tagline {
  font-size: 1rem;
  opacity: 0.85;
  color: var(--text-muted);
}

@media (max-width: 600px) {
  .header {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
}
</style>