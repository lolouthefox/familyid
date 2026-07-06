<script lang="ts">
	const profilePictures = {
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

{#each Object.keys(profilePictures) as packName, i (i)}
	{@const pack = profilePictures[packName]}
	<div>
		<h2>{packName}</h2>
		{#each new Array(pack.number) as _, i (i)}
			<img src={pack.path + (i + 1) + '.png'} alt={packName} />
		{/each}
	</div>
{/each}
