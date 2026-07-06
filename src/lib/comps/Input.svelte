<script lang="ts">
	let { value = $bindable(), ...props } = $props();
</script>

<input
	class="focus:outline-none border-gray-400 focus:border-pink-700 px-4 py-2 rounded-lg w-full"
	bind:value
	{...props}
/>
