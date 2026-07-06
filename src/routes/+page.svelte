<script>
	import PfpSelector from '$lib/comps/PfpSelector.svelte';

	let { data } = $props();
	let tab = $state('profil');
</script>

<main class="fixed inset-0 flex items-start justify-center bg-gray-100 md:pt-16">
	<div
		class="max-w-dvw w-full p-4 bg-white flex flex-col items-center fixed inset-0 rounded-0 md:rounded-3xl md:static md:max-w-md"
	>
		<img src="/branding/logo-color-alt.svg" alt="Logo" class="h-12 m-4 mb-8" />
		<div class="flex gap-2 w-full p-4 justify-center align-center">
			<button
				class="py-2 px-4 rounded-full bg-gray-200 disabled:bg-pink-700 disabled:text-white"
				disabled={tab === 'profil'}
				onclick={() => (tab = 'profil')}>Profil</button
			>
			<button
				class="py-2 px-4 rounded-full bg-gray-200 disabled:bg-pink-700 disabled:text-white"
				disabled={tab === 'modifier'}
				onclick={() => (tab = 'modifier')}>Modifier</button
			>
			<button
				class="py-2 px-4 rounded-full bg-gray-200 disabled:bg-pink-700 disabled:text-white"
				disabled={tab === 'avatar'}
				onclick={() => (tab = 'avatar')}>Avatar</button
			>
		</div>
		{#if tab === 'profil'}
			<img src={data.user.profilePicture} alt="" class="h-32 m-4 mb-2 rounded-full" />
			<h1 class="text-2xl font-bold mb-8">{data.user.username}</h1>
		{:else if tab === 'modifier'}
			<form>
				<label for="username">Username:</label>
				<input type="text" id="username" name="username" value={data.user.username} />
				<button type="submit">Save</button>
			</form>
		{:else if tab === 'avatar'}
			<PfpSelector />
		{/if}
	</div>
</main>
