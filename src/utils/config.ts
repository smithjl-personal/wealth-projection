import type { InputConfig, StepConfig } from "../types/config";
import { zeroIfNaN } from "./general";

export function isInputConfig(obj: unknown): obj is InputConfig {
	if (
		!obj ||
		typeof obj !== "object" ||
		!Array.isArray((obj as InputConfig).securities) ||
		!Array.isArray((obj as InputConfig).real_estate)
	) {
		return false;
	}

	const config = obj as InputConfig;

	return (
		config.securities.every(
			(sec) =>
				typeof sec.name === "string" &&
				typeof sec.value === "string" &&
				typeof sec.estimated_apy === "string",
		) &&
		config.real_estate.every(
			(re) =>
				typeof re.name === "string" &&
				typeof re.value === "string" &&
				typeof re.estimated_apy === "string" &&
				typeof re.mortgage_value === "string" &&
				typeof re.mortgage_apy === "string",
		)
	);
}

export function inputConfigToStepConfig(inputConfig: InputConfig): StepConfig {
	const stepConfig: StepConfig = {
		securities: [],
		real_estate: [],
	};

	stepConfig.securities = inputConfig.securities.map((security) => {
		return {
			id: security.id,
			name: security.name,
			value: zeroIfNaN(security.value),
			estimated_apy: zeroIfNaN(security.estimated_apy),
		};
	});

	// TODO: Set up this logic for real_estate as well.

	return stepConfig;
}
