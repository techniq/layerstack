<script lang="ts">
	import Preview from '$docs/Preview.svelte';
	import fetchStore from '$svelte-stores/fetchStore';
</script>

<h1>Usage</h1>

```js
import { fetchStore, initFetchClient } from '@layerstack/svelte-stores';

const state = fetchStore();

// Request new data
state.fetch(url, options?)

// Re-fetch last request (same url and options)
state.refresh();

// Clear data
state.clear();

// Request inflight
$state.loading

// Data (success)
$state.data

// Error (failure)
$state.error

// Fetch options
state.fetch(url, {
	as: 'auto' // 'auto' (default, determined by response `Content-Type`) | 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text'
})

// Disable fetching (control externally)
state.fetch(url, {
	disabled: isDisabled
})

// Force re-fetch even if data exists for current url (ignore cache)
state.fetch(url, {
	force: true
})

// Only fetch once (unless `force: true` is also set)
state.fetch(url, {
	once: true
})

// Transform data before updating `$state.data`
state.fetch(url, {
	onDataChange: (newData, currentData) => {
		// Useful to concat to existing data, transform data, etc.
		return newData;
	},
})

// Evaluate response
state.fetch(url, {
	onResponseChange: (response, data) => {
		// Useful to check `response.ok` or `response.status`,
		// refresh another fetch (ex. GET) after mutation (POST, PUT, PATCH, DELETE), etc
		// If value returned, will update `$state.data`
	},
})

// Initialize fetch client with global options (context, typically set in `+layout.svelte`)
initFetchClient({
	// Useful to set global headers such as `Authorization`
	options: () => {
		return {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
	},
})
```
