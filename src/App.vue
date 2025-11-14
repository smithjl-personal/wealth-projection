<script setup lang="ts">
	import EditConfig from "./components/EditConfig.vue";
	import ViewSimulation from "./components/ViewSimulation.vue";
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
	function removeSecurity(index: number) {
		config.value.securities.splice(index, 1);
	}

	function addRealEstate() {
		config.value.real_estate.push({
			id: uuidv6(),
			name: "",
			value: "",
			estimated_apy: "",
			mortgage_value: "",
			mortgage_apy: "0",
			mortgage_paid_monthly: "",
			after_payoff_target_security_id: "",
		});
	}
	function removeRealEstate(index: number) {
		config.value.real_estate.splice(index, 1);
	}
</script>

<template>
	<h1>Wealth Projection</h1>
	<p>
		Enter your assets that have no debt tied to them in the "securities"
		section. If you own your home, enter the mortgage info in the "real
		estate" section. Then pick how far you would like to simulate and click
		"Simulate". Once you have entered all of your data, it is reccommended
		that you save the configuration to the local storage using the provided
		button. This way you can always come back and load this data and modify
		it for testing other financial strategies. The app also allows you to
		save the configuration to the clipboard so you can save multiple
		configuations and compare and contrast them. Also, as a way to share
		configurations with others or across devices.
	</p>
	<EditConfig
		:config="config"
		@add-security="addSecurity"
		@remove-security="removeSecurity"
		@add-real-estate="addRealEstate"
		@remove-real-estate="removeRealEstate"
		@set-config="setConfig"
	/>
	<ViewSimulation :config="config" />
</template>

<style scoped></style>
