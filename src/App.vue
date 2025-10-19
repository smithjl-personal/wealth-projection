<script setup lang="ts">
	import EditConfig from "./components/EditConfig.vue";
	import type { InputConfig } from "./types/config";
	import { ref } from "vue";
	import { v6 as uuidv6 } from "uuid";

	const defaultConfig: InputConfig = {
		securities: [],
		real_estate: [],
	};
	const config = ref(defaultConfig);

	function setConfig(newConfig: InputConfig) {
		config.value = newConfig;
	}

	function addSecurity() {
		config.value.securities.push({
			id: uuidv6(),
			name: "",
			value: "",
			estimated_apy: "",
			added_monthly: "",
		});
	}
</script>

<template>
	<EditConfig
		:config="config"
		@add-security="addSecurity"
		@pasted-valid-config="setConfig"
	/>
</template>

<style scoped>
	.logo {
		height: 6em;
		padding: 1.5em;
		will-change: filter;
		transition: filter 300ms;
	}
	.logo:hover {
		filter: drop-shadow(0 0 2em #646cffaa);
	}
	.logo.vue:hover {
		filter: drop-shadow(0 0 2em #42b883aa);
	}
</style>
