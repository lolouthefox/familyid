<script lang="ts">
	import Button from '$lib/comps/Button.svelte';
	import { onMount } from 'svelte';

	let { data, form } = $props();

	let expandErrorDetails = $state(false);
	let redirectUrl: string | null = $state(null);
	let appId: string | null = $state(null);

	const scopeTranslations = {
		openid: 'Identifiant unique',
		profile: 'Informations personnelles'
	};

	onMount(() => {
		if (form?.redirectNow) {
			window.location.href = form.redirectNow;
		}
		const urlParams = new URLSearchParams(window.location.search);
		redirectUrl = urlParams.get('redirect_uri') ?? '/';
		appId = urlParams.get('app_id');
	});
</script>

<main class="fixed inset-0 flex items-center justify-center bg-gray-100">
	<div
		class="max-w-dvw w-full p-4 bg-white flex flex-col items-center fixed inset-0 rounded-0 md:rounded-3xl md:static md:max-w-md"
	>
		<img src="/branding/logo-color-alt.svg" alt="Logo" class="h-12 m-4 mb-8" />
		{#if data.error}
			<h1 class="text-2xl text-left w-full mb-2">Oops!</h1>
			<p class="text-gray-800">
				On dirait que cette application n'existe pas ou n'est pas configurée correctement. Contactez
				le développeur ou réessayez plus tard.
			</p>
			<button
				class="text-gray-500 hover:text-gray-700 underline cursor-pointer"
				onclick={() => (expandErrorDetails = !expandErrorDetails)}
				>{expandErrorDetails ? 'Moins' : 'Plus'} de détails</button
			>
			{#if expandErrorDetails}
				<p class="text-red-500">{data.error}</p>
			{/if}
		{:else if form?.error}
			<h1 class="text-2xl text-left w-full mb-2">Oops!</h1>
			<p class="text-gray-800">
				On dirait que cette application n'existe pas ou n'est pas configurée correctement. Contactez
				le développeur ou réessayez plus tard.
			</p>
			<button
				class="text-gray-500 hover:text-gray-700 underline cursor-pointer"
				onclick={() => (expandErrorDetails = !expandErrorDetails)}
				>{expandErrorDetails ? 'Moins' : 'Plus'} de détails</button
			>
			{#if expandErrorDetails}
				<p class="text-red-500">{form.error}</p>
			{/if}
		{:else}
			<div class="flex flex-col gap-1 w-full">
				<img src={data.app.iconUrl} alt={data.app.name} class="h-12 w-12" />
				<h1 class="text-2xl text-left w-full mb-2">Autorisez {data.app.name}</h1>
				<p>{data.app.name} veut accéder à ces données :</p>
				<ul class="list-disc">
					{#each data.scopes as scope (scope)}
						<li class="ml-5">{scopeTranslations[scope]}</li>
					{/each}
				</ul>
				<form method="post">
					<input type="hidden" name="app_id" value={appId} />
					<input type="hidden" name="redirect_uri" value={redirectUrl} />
					<input type="hidden" name="scope" value={data.scopes.join(',')} />
					<input type="hidden" name="response_type" value="code" />
					<Button type="submit">Autoriser {data.app.name}</Button>
				</form>
			</div>
		{/if}
	</div>
</main>
