<script setup lang="ts">
	import type { InputConfig, StepSecurity } from "../types/config";
	import {
		getNextMonthSecurityStep,
		inputConfigToStepConfig,
	} from "../utils/config";

	const props = defineProps<{ config: InputConfig }>();

	// Apex Charts: npm install --save apexcharts vue3-apexcharts
	function simulate() {
		const yearsAhead = 5;
		const monthsAhead = yearsAhead * 12;
		const inputConfig = props.config;
		const initialStepConfig = inputConfigToStepConfig(inputConfig);

		for (const security of initialStepConfig.securities) {
			const steps: StepSecurity[] = new Array(monthsAhead + 1);
			steps[0] = security;
			for (let month = 1; month <= monthsAhead; month++) {
				const priorMonth = steps[month - 1];
				if (priorMonth === undefined) {
					alert(
						"Can't calculate security value over time; no prior month.",
					);
					return;
				}
				steps[month] = getNextMonthSecurityStep(priorMonth);
			}
		}
	}
</script>

<template>
	<button type="button" @click="simulate">Simulate</button>
</template>

<style scoped></style>
