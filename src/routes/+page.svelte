<script>
	import PfpSelector from '$lib/comps/PfpSelector.svelte';

	let { data } = $props();
	let tab = $state('profil');
</script>

<main class="fixed inset-0 flex items-start justify-center bg-gray-100 md:pt-16 max-h-dvh">
	<div
		class="max-w-dvw w-full p-4 bg-white flex flex-col items-center fixed inset-0 rounded-0 md:rounded-3xl md:static md:max-w-md"
	>
		<img src="/branding/logo-color-alt.svg" alt="Logo" class="h-10 m-2 md:h-12 md:m-4 md:mb-8" />
		<div class="w-full overflow-x-auto">
			<div class="flex gap-2 p-4 align-center">
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
				<button
					class="py-2 px-4 rounded-full bg-gray-200 disabled:bg-pink-700 disabled:text-white"
					disabled={tab === 'apps'}
					onclick={() => (tab = 'apps')}>Apps</button
				>
			</div>
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
			<div class="overflow-y-scroll flex-1 w-full">
				<PfpSelector currentPfp={data.user.profilePicture} />
			</div>
		{:else if tab === 'apps'}
			<div class="w-full flex flex-col">
				<p>Voici toutes les applications disponibles sur FamilyID.</p>
				{#each data.apps as app (app.id)}
					<div class="flex items-center gap-4 w-full p-4">
						<img
							src={app.icon}
							alt={app.name}
							class="h-16 w-16 object-cover rounded-xl bg-gray-100 p-2"
						/>
						<p class="font-bold text-xl">{app.name}</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</main>
