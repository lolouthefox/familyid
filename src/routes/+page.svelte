<script lang="ts">
	import Button from '$lib/comps/Button.svelte';
	import Input from '$lib/comps/Input.svelte';
	import PfpSelector from '$lib/comps/PfpSelector.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	let tab = $state('profil');

	let upToDate = $state(true);
	let updated = $state(false);
	let errored = $state(false);

	let newUsername = $state('');
	let newPassword = $state('');

	onMount(() => {
		// Initialize newUsername with the user's current username
		newUsername = data.user.username;
	});

	function notifyUpdated() {
		upToDate = true;
		updated = true;
		setTimeout(() => {
			updated = false;
		}, 3000);
	}
	function notifyErrored() {
		upToDate = true;
		errored = true;
		setTimeout(() => {
			errored = false;
		}, 3000);
	}

	async function setProfilePicture(pfp: string) {
		upToDate = false;
		const res = await fetch('/api/profile', {
			method: 'PUT',
			body: JSON.stringify({ pfp })
		});
		if (res.ok) {
			data.user.profilePicture = pfp;
			notifyUpdated();
		} else {
			notifyErrored();
		}
	}

	async function updateUsername() {
		upToDate = false;
		const res = await fetch('/api/profile', {
			method: 'PUT',
			body: JSON.stringify({ username: newUsername })
		});
		if (res.ok) {
			data.user.username = newUsername;
			notifyUpdated();
		} else {
			notifyErrored();
		}
	}

	async function updatePassword() {
		upToDate = false;
		const res = await fetch('/api/profile', {
			method: 'PUT',
			body: JSON.stringify({ password: newPassword })
		});
		if (res.ok) {
			notifyUpdated();
		} else {
			notifyErrored();
		}
	}

	async function logout() {
		upToDate = false;
		const res = await fetch('/api/logout', {
			method: 'POST'
		});
		if (res.ok) {
			window.location.href = '/';
		} else {
			notifyErrored();
		}
	}
</script>

<main class="fixed inset-0 flex items-start justify-center bg-gray-100 md:pt-16 max-h-dvh">
	<div
		class="max-w-dvw w-full p-4 bg-white flex flex-col items-center fixed inset-0 rounded-0 md:rounded-3xl md:static md:max-w-md"
	>
		<img src="/branding/logo-color-alt.svg" alt="Logo" class="h-10 m-2 md:h-12 md:m-4 md:mb-8" />
		<div class="w-full overflow-x-auto">
			<div class="flex gap-2 py-4 align-center">
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
			<h1 class="text-2xl font-bold mb-8 flex items-center gap-1">
				{data.user.username}
				{#if data.user.role === 'admin'}
					<i class="ph-fill ph-shield-star text-pink-700"></i>
				{/if}
			</h1>
			<Button type="submit" onclick={logout}>Logout</Button>
		{:else if tab === 'modifier'}
			<div class="overflow-y-scroll flex-1 w-full flex flex-col gap-2 mt-4">
				<label for="username">Nom d'utilisateur:</label>
				<Input type="text" id="username" name="username" bind:value={newUsername} />
				<Button type="submit" onclick={updateUsername}>Save</Button>

				<label for="password">Mot de passe:</label>
				<Input type="password" id="password" name="password" bind:value={newPassword} />
				<Button type="submit" onclick={updatePassword}>Save</Button>
			</div>
		{:else if tab === 'avatar'}
			<div class="overflow-y-scroll flex-1 w-full">
				<PfpSelector currentPfp={data.user.profilePicture} {setProfilePicture} />
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

{#if !upToDate}
	<p
		class="text-center bg-gray-950 text-white fixed bottom-2 px-4 py-2 rounded-full left-1/2 -translate-x-1/2"
	>
		Mise à jour...
	</p>
{:else if updated}
	<p
		class="text-center bg-green-800 text-white fixed bottom-2 px-4 py-2 rounded-full left-1/2 -translate-x-1/2"
	>
		À jour!
	</p>
{:else if errored}
	<p
		class="text-center bg-red-800 text-white fixed bottom-2 px-4 py-2 rounded-full left-1/2 -translate-x-1/2"
	>
		Un problème est survenu
	</p>
{/if}
