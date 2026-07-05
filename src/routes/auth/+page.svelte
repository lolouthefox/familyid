<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/comps/Button.svelte';
	import Input from '$lib/comps/Input.svelte';
	import { onMount } from 'svelte';

	let { form } = $props();

	let action: undefined | 'login' | 'register' | 'authorize' = $state(undefined);
	let hasAuthStepHistoryEntry = $state(false);
	let isHandlingBackNavigation = $state(false);
	let redirectUrl: string | undefined = $state(undefined);

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		redirectUrl = urlParams.get('redirect_uri') ?? '/';

		const handlePopState = () => {
			if (action === undefined) return;

			isHandlingBackNavigation = true;
			action = undefined;

			queueMicrotask(() => {
				isHandlingBackNavigation = false;
			});
		};

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	});

	$effect(() => {
		if (typeof window === 'undefined') return;
		if (isHandlingBackNavigation) return;

		if (action !== undefined && !hasAuthStepHistoryEntry) {
			window.history.pushState({ oauthAction: true }, '', window.location.href);
			hasAuthStepHistoryEntry = true;
			return;
		}

		if (action === undefined) {
			hasAuthStepHistoryEntry = false;
		}
	});
</script>

<main class="fixed inset-0 flex items-center justify-center bg-gray-100">
	<div
		class="max-w-dvw w-full p-4 bg-white flex flex-col items-center fixed inset-0 rounded-0 md:rounded-3xl md:static md:max-w-md"
	>
		<img src="/branding/logo-color-alt.svg" alt="Logo" class="h-12 m-4 mb-8" />

		{#if action === 'login'}
			<h1 class="text-2xl text-left w-full mb-2">Login</h1>
			<form action="?/login" method="post" class="w-full flex flex-col gap-1" use:enhance>
				<Input type="text" placeholder="Username" name="username" />
				<Input type="password" placeholder="Password" name="password" />
				<input type="hidden" name="redirect_uri" value={redirectUrl} />
				<Button type="submit">Login</Button>
				<button
					type="button"
					class="text-gray-500 hover:text-gray-700 underline cursor-pointer"
					onclick={() => (action = 'register')}>Register instead</button
				>
			</form>
			<p class="text-red-500">{form?.error}</p>
		{:else if action === 'register'}
			<h1 class="text-2xl text-left w-full mb-2">Register</h1>
			<form action="?/register" method="post" class="w-full flex flex-col gap-1" use:enhance>
				<Input type="text" placeholder="Username" name="username" />
				<Input type="password" placeholder="Password" name="password" />
				<input type="hidden" name="redirect_uri" value={redirectUrl} />
				<Button type="submit">Register</Button>
				<button
					type="button"
					class="text-gray-500 hover:text-gray-700 underline cursor-pointer"
					onclick={() => (action = 'login')}>Login instead</button
				>
			</form>
			<p class="text-red-500">{form?.error}</p>
		{:else}
			<div class="flex flex-col gap-1 w-full">
				<p class="mb-4">
					Plus besoin de créer un compte pour chaque service que vous utilisez, FamilyID vous permet
					d'accéder à tous les services que vous utilisez comme Pit Stop, Homeflix, et plus encore.
				</p>
				<Button onclick={() => (action = 'login')}>Login</Button>
				<Button onclick={() => (action = 'register')}>Register</Button>
			</div>
		{/if}
	</div>
</main>
