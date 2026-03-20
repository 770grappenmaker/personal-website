<template>
  <Page>
    <section id="about" class="section about">
      <h2>about</h2>
      <p>
        Hi, I'm <strong>Koen</strong> (aka NotEvenJoking or 770grappenmaker on the internet). I'm a <strong>computer
          science</strong> and <strong>applied mathematics</strong> student at the University of Twente with a passion
        for software, interpreters
        & compilers, reverse engineering, competitive programming and a little bit of infrastructure administration.
      </p>
      <p>
        I have a particular interest in the <strong>JVM</strong>, and most
        of my projects are written in
        <strong>Kotlin</strong>, in which I have 5 years of experience writing software.
      </p>
    </section>

    <section id="contact" class="section contact">
      <h2>contact</h2>
      <div class="contact">
        <div class="contact-item">
          <strong>matrix</strong>
          <a href="https://matrix.to/#/@koen:koenoostveen.nl" class="handle">@koen:koenoostveen.nl</a>
        </div>
        <div class="contact-item">
          <strong>email</strong>
          <span class="email">koen <span class="email-part">(at sign)</span> koenoostveen <span
              class="email-part">(dot)</span> nl</span>
        </div>
        <div class="contact-item">
          <strong>github</strong>
          <a href="https://github.com/770grappenmaker" class="handle">@770grappenmaker</a>
        </div>
        <div class="contact-item">
          <span><strong>discord</strong> (if you must)</span>
          <span class="handle">@notevenjoking</span>
        </div>
      </div>
    </section>

    <section id="projects" class="section projects">
      <h2>projects</h2>
      <ul>
        <li><a href="https://github.com/770grappenmaker/advent-of-code" target="_blank" rel="noopener">Advent of
            Code</a> (2015-2025): Kotlin solutions, written as part of the speed contest.</li>
        <li><a href="https://github.com/770grappenmaker/nasty-jvm-util" target="_blank"
            rel="noopener">nasty-jvm-util</a>: bytecode/JVM utility library (Kotlin), generates JVM classes.</li>
        <li><a href="https://github.com/770grappenmaker/mappings-util" target="_blank" rel="noopener">mappings-util</a>:
          deobfuscation mapping library for JVM, mostly targeting Minecraft.</li>
        <li><a href="https://github.com/770grappenmaker/coachtaal-tooling" target="_blank"
            rel="noopener">coachtaal-tooling</a>: Coach simulation DSL compiler and tooling.</li>
        <li><a href="https://github.com/770grappenmaker/brainfuck-kt" target="_blank" rel="noopener">brainfuck-kt</a>:
          Brainfuck interpreter and compiler written in Kotlin.</li>
        <li><a href="https://github.com/770grappenmaker/synacor-challenge" target="_blank"
            rel="noopener">synacor-challenge</a>: solutions, debugger and VM for the custom architecture.</li>
      </ul>
    </section>

    <section id="services" class="section services">
      <div class="infra-outer">
        <h2>infra</h2>
        <div class="maps">
          <a href="/net" class="map-text">net</a>
          <a href="/map" class="map-text">map</a>
        </div>
      </div>
      <p>Personal infrastructure, serves mostly as a reference for myself</p>
      <ul>
        <li><strong>Matrix homeserver:</strong> <code>matrix.koenoostveen.nl</code></li>
        <li><strong>Copyparty file server:</strong> <code>files.koenoostveen.nl</code></li>
        <li><strong>Grafana dashboard:</strong> <code>grafana.koenoostveen.nl</code></li>
        <li><strong>Email:</strong> <code>mx.koenoostveen.nl</code> (<code>postmaster@koenoostveen.nl</code> for
          inquiries)</li>
      </ul>
    </section>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/Page.vue';
</script>

<style scoped>
.contact {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-item {
  display: flex;
  justify-content: space-between;
}

.email {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5pt;
  font-size: normal;
  flex-wrap: wrap;
  min-width: 0;
}

.email-part,
.handle,
.contact-item {
  min-width: 0;
}

.email-part {
  opacity: .3;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.map-text {
  font-size: 0.9rem;
  opacity: 0.75;
}

@media (max-width: 640px) {
  .contact {
    gap: 0.55rem;
  }

  .contact-item {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0.2rem;
    padding: 0.4rem 0.25rem;
    border-radius: 8px;
    background: rgba(27, 55, 83, 0.55);
  }

  .contact-item strong,
  .contact-item .handle,
  .contact-item .email {
    width: 100%;
    min-width: 0;
    margin: 0;
  }

  .contact-item .handle,
  .contact-item .email {
    overflow-wrap: anywhere;
    word-break: break-word;
  }
}

.maps {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.infra-outer {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.infra-outer h2 {
  flex-grow: 1;
  margin-bottom: 0;
}
</style>