<script lang="ts">
	const profilePictures = {
		Default: {
			path: 'https://familyid.liam-cheneval.dev/pfp/familyid/',
			number: 1
		},
		Family: {
			path: 'https://familyid.liam-cheneval.dev/pfp/family/',
			number: 6
		},
		Iconic: {
			path: 'https://familyid.liam-cheneval.dev/pfp/iconic/',
			number: 6
		},
		Peeps: {
			path: 'https://familyid.liam-cheneval.dev/pfp/peeps/',
			number: 6
		},
		'Nick Wilde': {
			path: 'https://familyid.liam-cheneval.dev/pfp/nick/',
			number: 6
		},
		'Pawbert Linxley': {
			path: 'https://familyid.liam-cheneval.dev/pfp/pawbert/',
			number: 6
		}
	};
</script>

<div class="max-h-dvh overflow-y-scroll">
	<div class="flex flex-col gap-4">
		{#each Object.keys(profilePictures) as packName, i (i)}
			{@const pack = profilePictures[packName]}

			<div class="flex flex-col gap-2">
				<h2 class="text-xl font-bold">{packName}</h2>
				<div class="w-full overflow-x-scroll">
					<div class="flex gap-2">
						{#each new Array(pack.number) as _, i (i)}
							<img src={pack.path + (i + 1) + '.png'} alt={packName} class="h-32 rounded-2xl" />
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
