<script lang="ts">
	import Button from '$lib/comps/Button.svelte';
	import { onMount } from 'svelte';

	let { data, form } = $props();

	let expandErrorDetails = $state(false);
	let redirectUrl: string | null = $state(null);
	let appId: string | null = $state(null);

	const scopeTranslations: Record<string, string> = {
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

<main
	class="fixed inset-0 flex items-center justify-center bg-linear-to-br from-pink-50 to-pink-100"
>
	<div
		class="max-w-dvw w-full p-4 bg-white flex flex-col items-start fixed inset-0 rounded-0 md:rounded-2xl md:static md:max-w-md md:shadow-2xl"
	>
		<div class="flex w-full items-center justify-between mb-8">
			<img src="/branding/logo-color-alt.svg" alt="Logo" class="h-10" />
			<!-- {#if !data.error && !form?.error}
				<a href="/" class="text-gray-400 hover:text-gray-600 transition-colors" title="Close">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</a>
			{/if} -->
		</div>

		{#if data.error}
			<div class="w-full">
				<h1 class="text-3xl font-bold text-gray-900 mb-3">Oops!</h1>
				<p class="text-gray-600 mb-4 leading-relaxed">
					On dirait que cette application n'existe pas ou n'est pas configurée correctement.
					Contactez le développeur ou réessayez plus tard.
				</p>
				<button
					class="text-pink-700 hover:text-pink-800 font-semibold transition-colors"
					onclick={() => (expandErrorDetails = !expandErrorDetails)}
					>{expandErrorDetails ? '▼' : '▶'} Détails techniques</button
				>
				{#if expandErrorDetails}
					<div class="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
						<p class="text-red-700 text-sm font-mono">{data.error}</p>
					</div>
				{/if}
			</div>
		{:else if form?.error}
			<div class="w-full">
				<h1 class="text-3xl font-bold text-gray-900 mb-3">Oops!</h1>
				<p class="text-gray-600 mb-4 leading-relaxed">
					On dirait que cette application n'existe pas ou n'est pas configurée correctement.
					Contactez le développeur ou réessayez plus tard.
				</p>
				<button
					class="text-pink-700 hover:text-pink-800 font-semibold transition-colors"
					onclick={() => (expandErrorDetails = !expandErrorDetails)}
					>{expandErrorDetails ? '▼' : '▶'} Détails techniques</button
				>
				{#if expandErrorDetails}
					<div class="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
						<p class="text-red-700 text-sm font-mono">{form.error}</p>
					</div>
				{/if}
			</div>
		{:else}
			<div class="w-full space-y-6">
				{#if data.app}
					<div class="flex items-center gap-4">
						<div
							class="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden"
						>
							<img src={data.app.iconUrl} alt={data.app.name} class="w-full h-full object-cover" />
						</div>
						<div>
							<h1 class="text-2xl font-bold text-gray-900">{data.app.name}</h1>
							<p class="text-sm text-gray-500">demande l'accès à vos données</p>
						</div>
					</div>
				{/if}

				{#if data.scopes}
					<div>
						<h2 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
							Accès demandé
						</h2>
						<ul class="space-y-2">
							{#each data.scopes as scope (scope)}
								<li class="flex items-center gap-3 text-gray-700">
									<svg
										class="w-5 h-5 text-pink-600 shrink-0"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
									<span>{scopeTranslations[scope] || scope}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<p class="text-xs text-gray-500 italic">
					Vous contrôlez vos données. Vous pouvez révoquer cet accès à tout moment.
				</p>

				<form method="post" class="space-y-3">
					<input type="hidden" name="app_id" value={appId} />
					<input type="hidden" name="redirect_uri" value={redirectUrl} />
					<input type="hidden" name="scope" value={data.scopes?.join(',') ?? ''} />
					<input type="hidden" name="response_type" value="code" />
					<Button type="submit">
						Autoriser {data.app?.name}
					</Button>
					<!-- <a
						href="/"
						class="block w-full text-center text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
					>
						Refuser
					</a> -->
				</form>
			</div>
		{/if}
	</div>
</main>
