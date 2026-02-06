<script lang="ts">
  let file: File | null = null;
  export let hash = "";
  let error = "";
  let dragging = false;
  let inputRef: HTMLInputElement;

  async function handleFile(selectedFile: File) {
    try {
      error = "";
      hash = "";
      file = selectedFile;

      const buffer = await readFileAsArrayBuffer(file);
      const digest = await crypto.subtle.digest("SHA-256", buffer);
      hash = bufferToHex(digest);
    } catch (e) {
      console.error(e);
      error = "Error al procesar el archivo.";
      reset();
    }
  }

  function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  function bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function onInputChange(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files && files[0]) handleFile(files[0]);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    if (e.dataTransfer?.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function reset() {
    file = null;
    hash = "";
    error = "";
    inputRef.value = "";
  }
</script>

<div
  class="dropzone"
  class:dragging
  on:dragover|preventDefault={() => dragging = true}
  on:dragleave={() => dragging = false}
  on:drop={onDrop}
  role="button"
  tabindex="0"
>
  {#if !file}
    <p>Arrastra un archivo aquí o haz clic para seleccionar</p>
    <input
      bind:this={inputRef}
      type="file"
      on:change={onInputChange}
    />
  {:else}
    <div class="info">
      <p><strong>Nombre:</strong> {file.name}</p>
      <p><strong>Tamaño:</strong> {(file.size / 1024).toFixed(2)} KB</p>
      <p class="hash"><strong>Hash SHA-256:</strong></p>
      <code>0x{hash}</code>
      <button on:click={reset}>Cambiar archivo</button>
    </div>
  {/if}
</div>

{#if error}
  <p class="error">{error}</p>
{/if}

<style>
  .dropzone {
    border: 2px dashed #6b7280;
    border-radius: 14px;
    padding: 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s ease;
    background: #0f172a;
    color: #e5e7eb;
    position: relative;
  }

  .dropzone.dragging {
    border-color: #38bdf8;
    background: #020617;
  }

  input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }

  .info {
    text-align: left;
    word-break: break-all;
  }

  code {
    display: block;
    background: #020617;
    padding: 12px;
    border-radius: 8px;
    color: #38bdf8;
    font-size: 0.85rem;
    margin: 8px 0 16px;
    word-break: break-all;
  }

  button {
    padding: 10px 18px;
    border-radius: 10px;
    border: none;
    background: #38bdf8;
    color: #020617;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  button:hover {
    background: #0ea5e9;
  }

  .error {
    margin-top: 12px;
    color: #f87171;
    font-weight: 500;
  }
</style>