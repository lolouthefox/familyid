<script lang="ts">
	let { ...props } = $props();
</script>

<input
	class="focus:outline-none border-gray-400 focus:border-pink-700 px-4 py-2 rounded-lg w-full"
	{...props}
/>
