<script setup lang="ts">
	import VueApexCharts from "vue3-apexcharts";
	import type {
		InputConfig,
		StepRealEstate,
		StepSecurity,
	} from "../types/config";
	import type { ApexTooltipContext } from "../types/apexcharts";
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
			shared: true,
			intersect: false,
			custom: (opts: {
				series: number[][];
				seriesIndex: number;
				dataPointIndex: number;
				w: ApexTooltipContext;
			}): string => {
				const usdFormatter = new Intl.NumberFormat("en-US", {
					style: "currency",
					currency: "USD",
				});
				const { series, dataPointIndex, w } = opts;
				let resultHTML = `<div style="color: black; padding:8px; text-align: left">`;

				for (
					let seriesIndex = 0;
					seriesIndex < series.length;
					seriesIndex++
				) {
					const assetName =
						w?.globals?.seriesNames?.[seriesIndex] ??
						`Series ${seriesIndex}`;
					const color = w.globals.colors[seriesIndex] ?? "black";
					const assetValue =
						series?.[seriesIndex]?.[dataPointIndex] ?? 0;
					resultHTML += `
                        <div>
                            <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${color}; margin-right:8px;"></span>
                            <span style="font-weight:700; margin-bottom:6px;">${assetName}</span>:
                            ${usdFormatter.format(assetValue)}
                        </div>`;
				}

				// Add up the values for each series at the given dataPointIndex.
				const totalValue = series
					.map((s) => s[dataPointIndex] ?? 0)
					.reduce((prior, current) => prior + current, 0);
				resultHTML += `
                        <div style="margin-top:6px; border-top:1px solid #eee; padding-top:6px;">
                            <strong>Total Net Worth:</strong> ${usdFormatter.format(totalValue)}
                        </div>`;

				resultHTML += `</div>`;
				return resultHTML;
			},
		},
		xaxis: {
			type: "numeric",
			tickAmount: 20,
			title: {
				text: "Months Ahead",
			},
			labels: {
				formatter: (value: string) => parseInt(value).toFixed(0),
			},
		},
		yaxis: {
			title: {
				text: "Net Worth",
			},
			labels: {
				formatter: (value: number) => {
					if (value >= 1_000_000) {
						return `${(value / 1_000_000).toFixed(1)}M`;
					} else if (value >= 1_000) {
						return `${Math.round(value / 1_000)}K`;
					} else {
						return value.toString();
					}
				},
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

		// After mortgage is paid off, direct the funds elsewhere if requested.
		// Key is "month-security.id"
		const afterMortgagePayoff = new Map<string, number>();

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

					// If we have a target after payoff, mark it.
					if (thisMonth.after_payoff_target_security_id.length) {
						const key =
							month +
							"-" +
							thisMonth.after_payoff_target_security_id;
						afterMortgagePayoff.set(
							key,
							thisMonth.mortgage_paid_monthly,
						);
					}
				}

				steps[month] = thisMonth;
			}

			// Now that the data is calculated, format it for apex-charts.
			series.value.push({
				name: property.name,
				data: steps.map((re) => re.value - re.mortgage_value),
			});
		}

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

				const thisMonth = getNextMonthSecurityStep(priorMonth);

				// Now, check if we just paid off a mortgage. If so, add that to the correct asset.
				const key = month + "-" + thisMonth.id;
				if (afterMortgagePayoff.has(key)) {
					thisMonth.added_monthly +=
						afterMortgagePayoff.get(key) ?? 0;
				}

				steps[month] = thisMonth;
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
	<label>Simulation Distance</label>
	<select v-model="yearsAhead">
		<option :value="5">5 years</option>
		<option :value="10">10 years</option>
		<option :value="20">20 years</option>
		<option :value="30">30 years</option>
	</select>
	<br />
	<button type="button" @click="simulate">
		<FontAwesomeIcon icon="paper-plane" />
		Simulate
	</button>

	<VueApexCharts type="area" :options="chartOptions" :series="series" />

	<!--
        TODO: Make new section to output some useful data. Like:
        - When financial independence will be reached.
    -->
	<h3>Notices</h3>
	<div v-for="notice in notices" :key="notice">{{ notice }}</div>
</template>

<style scoped></style>
