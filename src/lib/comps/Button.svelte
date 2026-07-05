<script lang="ts">
	let { children, ...props } = $props();
</script>

<button
	class="bg-pink-700 text-white px-4 py-2 rounded-lg w-full cursor-pointer hover:bg-pink-800 transition duration-250"
	{...props}
>
	{@render children()}
</button>
