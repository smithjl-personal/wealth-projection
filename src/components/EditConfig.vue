<script setup lang="ts">
	import type { Config } from "../types/config";
	import { isConfig } from "../utils/validators/configValidator";
	import { defineEmits, defineProps } from "vue";

	const emit = defineEmits([
		"add-security",
		"add-real-estate",
		"pasted-valid-config",
	]);
	const props = defineProps<{ config: Config }>();

	async function copyConfigToClipboard() {
		const serializedConfig = JSON.stringify(props.config);
		try {
			await navigator.clipboard.writeText(serializedConfig);
		} catch {
			alert("Unable to access clipboard (write).");
		}
	}

	async function pasteConfigFromClipboard() {
		let clipboardText = "";
		try {
			clipboardText = await navigator.clipboard.readText();
		} catch {
			alert("Unable to access clipboard (read).");
			return;
		}

		let parsedObject = {};
		try {
			parsedObject = JSON.parse(clipboardText);
		} catch {
			alert("Invalid object (parsing).");
			return;
		}

		if (!isConfig(parsedObject)) {
			alert("Invalid object (not config).");
			return;
		}

		emit("pasted-valid-config", parsedObject);
	}
</script>

<template>
	<button type="button" @click="copyConfigToClipboard">
		Copy Config to Clipboard
	</button>
	<button type="button" @click="pasteConfigFromClipboard">
		Paste Config from Clipboard
	</button>
	<h1>
		<button type="button" @click="emit('add-security')">+</button>
		Securities
	</h1>
	<div v-for="security in config.securities" :key="security.id">
		<label>Name</label>
		<input type="text" v-model="security.name" />

		<label>Current Value</label>
		<input type="text" v-model="security.value" />

		<label>Estimated APY</label>
		<input type="text" v-model="security.estimated_apy" />

		<hr />
	</div>
</template>

<style scoped>
	.read-the-docs {
		color: #888;
	}
</style>
