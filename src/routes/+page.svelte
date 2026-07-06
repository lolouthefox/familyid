<script>
	import PfpSelector from '$lib/comps/PfpSelector.svelte';

	let { data } = $props();
</script>

<main class="fixed inset-0 flex items-center justify-center bg-gray-100">
	<div
		class="max-w-dvw w-full p-4 bg-white flex flex-col items-center fixed inset-0 rounded-0 md:rounded-3xl md:static md:max-w-md"
	>
		<img src="/branding/logo-color-alt.svg" alt="Logo" class="h-12 m-4 mb-8" />
		<h1>Welcome {data.user.username}</h1>
		<PfpSelector />
	</div>
</main>
