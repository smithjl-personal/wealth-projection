<script setup lang="ts">
	import VueApexCharts from "vue3-apexcharts";
	import type { InputConfig, StepSecurity } from "../types/config";
	import {
		getNextMonthSecurityStep,
		inputConfigToStepConfig,
	} from "../utils/config";
	import type { ApexOptions } from "apexcharts";
	import { ref } from "vue";

	const props = defineProps<{ config: InputConfig }>();

	const series = ref<ApexAxisChartSeries>([]);
	const chartOptions = ref<ApexOptions>({
		title: {
			text: "Wealth Over Time",
		},
		chart: {
			stacked: true,
		},
		dataLabels: {
			enabled: false,
		},
		plotOptions: {
			area: {
				fillTo: "origin",
			},
		},
		tooltip: {
			enabled: false,
		},
		xaxis: {
			type: "numeric",
			tickAmount: 20,
			title: {
				text: "Months Ahead",
			},
		},
		yaxis: {
			title: {
				text: "Net Worth",
			},
		},
	});

	function simulate() {
		const yearsAhead = 5;
		const monthsAhead = yearsAhead * 12;
		const inputConfig = props.config;
		const initialStepConfig = inputConfigToStepConfig(inputConfig);
		series.value = [];

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

			// Now that the data is calculated, format it for apex-charts.
			series.value.push({
				name: security.name,
				data: steps.map((s) => s.value),
			});
		}
	}
</script>

<template>
	<button type="button" @click="simulate">Simulate</button>
	<VueApexCharts type="area" :options="chartOptions" :series="series" />
</template>

<style scoped></style>
