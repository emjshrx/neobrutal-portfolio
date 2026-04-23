<script>
  import { fly } from "svelte/transition";
  let open = false;
  function handleClose() {
    open = false;
  }
  function handleClick(e) {
    open = !open;
  }
  export let currentPage;
</script>

<svelte:window on:scroll={handleClose} />
<div class="md:hidden">
  <nav>
    <button
      class="w-10 h-10 relative focus:outline-none"
      on:click={handleClick}
      on:blur={handleClose}
    >
      <span class="sr-only">Open main menu</span>
      <div
        class="block w-5 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <span
          aria-hidden="true"
          class={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out bg-black ${
            open ? "rotate-45" : "-translate-y-1.5"
          }`}
        />
        <span
          aria-hidden="true"
          class={`block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out bg-black ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          aria-hidden="true"
          class={`block absolute h-0.5 w-5 bg-current transform transition duration-200 ease-in-out bg-black ${
            open ? "-rotate-45" : "translate-y-1.5"
          }`}
        />
      </div>
    </button>
    {#if open}
      <div class="flex flex-col w-full left-0 absolute top-20 -translate-y-1">
        <a
          in:fly={{ y: -10, duration: 100, delay: 0 }}
          out:fly={{ y: -5, duration: 100, delay: 100 }}
          href="/"
          class={`text-center  text-2xl p-2 border-b border-x z-20 ${
            currentPage == "Home"
              ? "border-black bg-black text-white"
              : "bg-green"
          }`}>Home</a
        >
        <a
          transition:fly={{ y: -10, duration: 100, delay: 50 }}
          href="/about"
          class={`text-center text-2xl p-2 border-b border-x z-10 ${
            currentPage == "About"
              ? "border-black bg-black text-white"
              : "bg-green"
          }`}>About</a
        >
        <a
          transition:fly={{ y: -10, duration: 100, delay: 50 }}
          href="/blog"
          class={`text-center text-2xl p-2 border-b border-x z-10 ${
            currentPage == "Blog"
              ? "border-black bg-black text-white"
              : "bg-green"
          }`}>Blog</a
        >
        <a
          in:fly={{ y: -10, duration: 100, delay: 100 }}
          out:fly={{ y: -10, duration: 100, delay: 0 }}
          href="/projects"
          class={`text-center text-2xl p-2 border-b  border-x rounded-b-lg z-0 ${
            currentPage == "Projects"
              ? "border-black bg-black text-white"
              : "bg-green"
          }`}>Projects</a
        >
      </div>
    {/if}
  </nav>
</div>
