<script setup lang="ts">
	import VueApexCharts from "vue3-apexcharts";
	import type {
		InputConfig,
		StepRealEstate,
		StepSecurity,
	} from "../types/config";
	import {
		getNextMonthRealEstateStep,
		getNextMonthSecurityStep,
		inputConfigToStepConfig,
	} from "../utils/config";
	import type { ApexOptions } from "apexcharts";
	import { ref } from "vue";

	const props = defineProps<{ config: InputConfig }>();

	const yearsAhead = ref(5);
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

	const notices = ref<string[]>([]);

	function simulate() {
		const monthsAhead = yearsAhead.value * 12;
		const inputConfig = props.config;
		const initialStepConfig = inputConfigToStepConfig(inputConfig);

		// Reset simulation data.
		series.value = [];
		notices.value = [];

		// Securities.
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

		// Real-estate.
		for (const property of initialStepConfig.real_estate) {
			const steps: StepRealEstate[] = new Array(monthsAhead + 1);
			steps[0] = property;
			for (let month = 1; month <= monthsAhead; month++) {
				const priorMonth = steps[month - 1];
				if (priorMonth === undefined) {
					alert(
						"Can't calculate security value over time; no prior month.",
					);
					return;
				}

				const thisMonth = getNextMonthRealEstateStep(priorMonth);

				// Calculate notices.
				if (
					thisMonth.mortgage_value <= 0 &&
					priorMonth.mortgage_value > 0
				) {
					const paidOffInYears = (month / 12).toFixed(1);
					notices.value.push(
						`Morgage is paid off on month ${month}, or ${paidOffInYears} years.`,
					);
				}

				steps[month] = thisMonth;
			}

			// Now that the data is calculated, format it for apex-charts.
			series.value.push({
				name: property.name,
				data: steps.map((re) => re.value - re.mortgage_value),
			});
		}
	}
</script>

<template>
	<label>Simulation Distance</label>
	<select v-model="yearsAhead">
		<option :value="5">5 years</option>
		<option :value="10">10 years</option>
		<option :value="20">20 years</option>
		<option :value="30">30 years</option>
	</select>
	<br />
	<button type="button" @click="simulate">Simulate</button>

	<!-- TODO: Style this chart better, with nice tooltips? And other meta-data? -->
	<VueApexCharts type="area" :options="chartOptions" :series="series" />

	<!--
        TODO: Make new section to output some useful data. Like:
        - When mortgages will be paid off.
        - When financial independence will be reached.
    -->
	<h3>Notices</h3>
	<div v-for="notice in notices" :key="notice">{{ notice }}</div>
</template>

<style scoped></style>
