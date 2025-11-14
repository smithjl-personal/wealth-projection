<script setup lang="ts">
	import type { InputConfig } from "../types/config";
	import { isInputConfig } from "../utils/config";

	const emit = defineEmits([
		"add-security",
		"remove-security",
		"add-real-estate",
		"remove-real-estate",
		"set-config",
	]);
	const props = defineProps<{ config: InputConfig }>();

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

		if (!isInputConfig(parsedObject)) {
			alert("Invalid object (not config).");
			return;
		}

		emit("set-config", parsedObject);
	}

	function saveConfigToLocalStorage() {
		const config = props.config;
		localStorage.setItem("config", JSON.stringify(config));
	}
	function loadConfigFromLocalStorage() {
		const rawConfig = localStorage.getItem("config");
		if (rawConfig === null) {
			alert("No prior config was saved locally.");
			return;
		}

		let parsedObject = {};
		try {
			parsedObject = JSON.parse(rawConfig);
		} catch {
			alert("Failed to parse object from local storage.");
			return;
		}

		if (!isInputConfig(parsedObject)) {
			alert(
				"Object parsed from local storage, but format is not correct.",
			);
			return;
		}

		emit("set-config", parsedObject);
	}
</script>

<template>
	<button type="button" @click="copyConfigToClipboard">
		Copy Config to Clipboard
	</button>
	<button type="button" @click="pasteConfigFromClipboard">
		Paste Config from Clipboard
	</button>
	<br />
	<button type="button" @click="saveConfigToLocalStorage">
		Save Config to Local Storage
	</button>
	<button type="button" @click="loadConfigFromLocalStorage">
		Load Config from Local Storage
	</button>
	<h3>
		<button type="button" @click="emit('add-security')">
			<FontAwesomeIcon icon="plus" />
		</button>
		Securities
	</h3>
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Current Value ($)</th>
				<th>Estimated APY (%)</th>
				<th>Added Per Month ($)</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="(security, index) in config.securities"
				:key="security.id"
			>
				<td>
					<input type="text" v-model="security.name" />
				</td>
				<td>
					<input type="text" v-model="security.value" />
				</td>
				<td>
					<input type="text" v-model="security.estimated_apy" />
				</td>
				<td>
					<input type="text" v-model="security.added_monthly" />
				</td>
				<td>
					<button
						type="button"
						@click="emit('remove-security', index)"
					>
						<FontAwesomeIcon icon="trash" />
					</button>
				</td>
			</tr>
		</tbody>
	</table>

	<h3>
		<button type="button" @click="emit('add-real-estate')">
			<FontAwesomeIcon icon="plus" />
		</button>
		Real Estate
	</h3>
	<table>
		<thead>
			<tr>
				<th>Name</th>
				<th>Property Value ($)</th>
				<th>Estimated Property APY (%)</th>
				<th>Mortgage Value ($)</th>
				<th>Mortgage APY (%)</th>
				<th>
					<span
						title="This should only include principal and interest. Do not include taxes and insurance here."
					>
						<FontAwesomeIcon icon="info-circle" />
					</span>
					Mortgage Paid Monthly ($)
				</th>
				<th>
					<span
						title="This gives you the option to specify where the monthly payment for this mortgage should go once paid off."
					>
						<FontAwesomeIcon icon="info-circle" />
					</span>
					Assets After Payoff
				</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			<tr
				v-for="(real_estate, index) in config.real_estate"
				:key="real_estate.id"
			>
				<td>
					<input type="text" v-model="real_estate.name" />
				</td>
				<td>
					<input type="text" v-model="real_estate.value" />
				</td>
				<td>
					<input type="text" v-model="real_estate.estimated_apy" />
				</td>
				<td>
					<input type="text" v-model="real_estate.mortgage_value" />
				</td>
				<td>
					<input type="text" v-model="real_estate.mortgage_apy" />
				</td>
				<td>
					<input
						type="text"
						v-model="real_estate.mortgage_paid_monthly"
					/>
				</td>
				<td>
					<select
						v-model="real_estate.after_payoff_target_security_id"
					>
						<option value="">None</option>
						<option
							v-for="security in config.securities"
							:value="security.id"
							:key="security.id"
						>
							{{ security.name }}
						</option>
					</select>
				</td>
				<td>
					<button
						type="button"
						@click="emit('remove-real-estate', index)"
					>
						<FontAwesomeIcon icon="trash" />
					</button>
				</td>
			</tr>
		</tbody>
	</table>
</template>

<style scoped></style>
