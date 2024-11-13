<script lang="ts">
  import { slide, blur } from "svelte/transition";
  import { itemQueue } from "./lib/getNext";
  import type { Item } from "./lib/getNext";
  import Icon from "@iconify/svelte";

  let right: Item = $state(itemQueue.getNext());
  let left: Item = $state(itemQueue.getNext());
  let score = $state(0);
  let highScore = $derived.by(() => {
    let localScore = 0;
    if (localStorage.getItem("highScore")) {
      localScore = parseInt(localStorage.getItem("highScore") as string);
    }

    if (score > localScore) {
      localScore = score;
      localStorage.setItem("highScore", score.toString());
    }
    return localScore;
  });
  let isCorrect = $state(0);
  let showActual = $state(false);

  const numberFormatter = Intl.NumberFormat("en-US");

  const correct = () => {
    isCorrect = 1;
    showActual = true;
    score++;

    setTimeout(() => {
      showActual = false;
      isCorrect = 0;

      let prevValue = { ...right };

      const nextValue = itemQueue.getNext();
      right.name = nextValue.name;
      right.count = nextValue.count;

      left.count = prevValue.count;
      left.name = prevValue.name;
    }, 3000);
  };

  const reset = () => {
    showActual = false;
    isCorrect = 0;
    score = 0;
    itemQueue.randomize();

    let temp = itemQueue.getNext();
    right.name = temp.name;
    right.count = temp.count;

    temp = itemQueue.getNext();
    left.name = temp.name;
    left.count = temp.count;
  };

  const onHigher = () => {
    if (right.count >= left.count) {
      correct();
    } else {
      isCorrect = -1;
    }
  };

  const onLower = () => {
    if (right.count <= left.count) {
      correct();
    } else {
      isCorrect = -1;
    }
  };
</script>

<svelte:head>
  <title>
    Minimal Higher/Lower
  </title>
</svelte:head>

<main class="border-zinc-700 p-4 text-zinc-200">
  <section class="w-[300px] mx-auto">
    <h2 class="text-center text-3xl font-bold my-8 uppercase tracking-widest">
      <span class="text-green-700">Higher</span>/<span class="text-red-700"
        >Lower</span
      >
    </h2>
    <div class="flex justify-between font-mono px-2 mb-2 text-sm text-zinc-400">
      <span>Score: {score}</span>
      <span>High Score: {highScore}</span>
    </div>
    <div
      class="p-6 flex flex-col justify-between h-[200px] border border-zinc-700 items-start bg-zinc-800"
    >
      {#key left.name}
        <p in:slide={{ delay: 200 }} class="text-lg">
          {left.name} <small class="text-zinc-600">has</small>
        </p>
      {/key}
      <div>
        {#key left.count}
          <strong in:blur class="text-7xl font-mono text-zinc-300 teko-font"
            >{numberFormatter.format(left.count)}</strong
          >
        {/key}
        <p class="text-zinc-500">Monthly search on the internet</p>
      </div>
    </div>
    <div
      class="relative p-6 flex flex-col justify-between h-[200px] border border-zinc-700 items-start bg-zinc-800"
    >
      <div
        class={`${isCorrect === 1 ? "bg-green-600" : isCorrect === -1 ? "bg-red-600" : "bg-zinc-900"} absolute flex justify-center overflow-hidden
              items-center h-10 w-10 rounded-full border-zinc-700 border-2  text-white top-0 left-1/2 -translate-x-1/2 -translate-y-1/2`}
      >
        {#if isCorrect == 1}
          <span in:slide>
            <Icon icon="material-symbols:check" />
          </span>
        {:else if isCorrect == -1}
          <span in:slide>
            <Icon icon="charm:cross" />
          </span>
        {:else}
          <span in:slide class="text-xs">VS</span>
        {/if}
      </div>
      {#key right.name}
        <p in:slide={{ delay: 300 }} class="text-lg">
          {right.name} <small class="text-zinc-600">has</small>
        </p>
      {/key}
      <div>
        {#if showActual}
          <strong in:blur class="text-7xl font-mono text-zinc-300 teko-font"
            >{numberFormatter.format(right.count)}</strong
          >
        {:else}
          <div in:slide class="flex w-full gap-1 mb-2">
            <button
              class="flex-1 p-4 bg-zinc-700 hover:bg-zinc-600 transition disabled:bg-zinc-950 disabled:hover:bg-zinc-950"
              disabled={isCorrect === -1}
              onclick={onHigher}>Higher</button
            >
            <button
              class="flex-1 p-4 bg-zinc-700 hover:bg-zinc-600 transition disabled:bg-zinc-950 disabled:hover:bg-zinc-950"
              disabled={isCorrect === -1}
              onclick={onLower}>Lower</button
            >
          </div>
        {/if}
        <p class="text-zinc-500">Monthly search on the internet</p>
      </div>
    </div>
    <div
      class={`h-2 transition-all bg-red-300 ${showActual ? "w-full duration-[3000ms]" : "w-0 duration-[0ms]"}`}
    ></div>
    {#if isCorrect === -1}
      <div class="text-center">
        <button
          class="flex-1 p-4 bg-blue-700 hover:bg-blue-600 transition"
          onclick={reset}>Reset</button
        >
      </div>
    {/if}
  </section>
</main>
