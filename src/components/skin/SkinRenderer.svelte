<script lang="ts" module>
  export interface Props extends Omit<
    Partial<SkinViewerOptions>,
    "enableControls" | "cape" | "renderPaused"
  > {
    cape?: CapeSource;
    controls?: Controls;
    height: number;
    username?: string;
    uuid: string;
    walking?: boolean;
    class?: string;
  }
</script>

<script lang="ts">
  import {
    NameTagObject,
    SkinViewer,
    type SkinViewerOptions,
    WalkingAnimation,
  } from "skinview3d";

  import { Controls, isControlEnabled } from "$components/skin";
  import { cn, isWebGL } from "$utils";
  import { CapeSource } from "$data";

  const {
    cape,
    controls,
    height,
    username,
    uuid,
    walking = false,
    class: clazz,
    ...options
  } = $props() as Props;
  const width = (height / 832) * 512;

  // svelte-ignore non_reactive_update
  let canvas: HTMLCanvasElement;
  const webgl = isWebGL();
  let loading = $state(webgl);
  if (webgl) {
    $effect(() => {
      (async () => {
        const viewer = new SkinViewer({
          canvas,
          cape: cape ? `/mc/cape/${uuid}.webp` : undefined,
          height,
          nameTag: new NameTagObject(username, {
            font: "24px Minecraft",
          }),
          renderPaused: true,
          skin: `/mc/skin/${uuid}.webp`,
          width,
          zoom: 0.75,
          ...options,
        });

        if (walking) {
          viewer.animation = new WalkingAnimation();
        }

        // controls
        if (!isControlEnabled(Controls.RotateVert, controls)) {
          viewer.controls.minPolarAngle = Math.PI / 2;
          viewer.controls.maxPolarAngle = Math.PI / 2;
        }

        if (!isControlEnabled(Controls.RotateHori, controls)) {
          viewer.controls.minAzimuthAngle = 0;
          viewer.controls.maxAzimuthAngle = 0;
        }

        if (!isControlEnabled(Controls.Zoom, controls)) {
          viewer.controls.enableZoom = false;
        }

        let lastTimestamp = -1;
        function render(timestamp: number) {
          // animate
          const deltaTime = (timestamp - lastTimestamp) / 1000;
          viewer.animation?.update(viewer.playerObject, deltaTime);
          lastTimestamp = timestamp;

          // render
          viewer.render();
          requestAnimationFrame(render);

          // mark as loaded
          if (loading) loading = false;
        }

        requestAnimationFrame(render);
      })();
    });
  }
</script>

{#if webgl}
  <canvas bind:this={canvas} class={cn(loading ? "hidden" : "", clazz)}
  ></canvas>
{/if}

{#if !webgl || loading}
  <figure class={cn("flex flex-col items-center text-center", clazz)}>
    <img
      src={`/mc/render/${uuid}.webp`}
      alt={username}
      {height}
      {width}
      class="block"
    />
    <figcaption class="text-subtext0 wrap-break-words mt-4 w-56 text-sm">
      {#if !webgl}
        If you enable WebGL this render will become interactive!
      {:else}
        Loading skin renderer...
      {/if}
    </figcaption>
  </figure>
{/if}
