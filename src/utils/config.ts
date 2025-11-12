import type {
	InputConfig,
	StepConfig,
	StepRealEstate,
	StepSecurity,
} from "../types/config";

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
				typeof sec.estimated_apy === "string" &&
				typeof sec.added_monthly === "string",
		) &&
		config.real_estate.every(
			(re) =>
				typeof re.name === "string" &&
				typeof re.value === "string" &&
				typeof re.estimated_apy === "string" &&
				typeof re.mortgage_value === "string" &&
				typeof re.mortgage_apy === "string" &&
				typeof re.after_payoff_target_security_id === "string",
		)
	);
}

export function inputConfigToStepConfig(inputConfig: InputConfig): StepConfig {
	const stepConfig: StepConfig = {
		securities: [],
		real_estate: [],
	};

	stepConfig.securities = inputConfig.securities.map((sec) => {
		return {
			id: sec.id,
			name: sec.name,
			value: configNumberParse(sec.value),
			estimated_apy: configNumberParse(sec.estimated_apy),
			added_monthly: configNumberParse(sec.added_monthly),
		};
	});

	stepConfig.real_estate = inputConfig.real_estate.map((re) => {
		return {
			id: re.id,
			name: re.name,
			value: configNumberParse(re.value),
			estimated_apy: configNumberParse(re.estimated_apy),
			mortgage_value: configNumberParse(re.mortgage_value),
			mortgage_apy: configNumberParse(re.mortgage_apy),
			mortgage_paid_monthly: configNumberParse(re.mortgage_paid_monthly),
			after_payoff_target_security_id: re.after_payoff_target_security_id,
		};
	});

	return stepConfig;
}

export function getNextMonthSecurityStep(security: StepSecurity): StepSecurity {
	const { value, added_monthly, estimated_apy } = security;

	const newValueBeforeGrowth = value + added_monthly;
	const monthlyRate = estimated_apy / 100 / 12;
	const newValue = newValueBeforeGrowth * (1 + monthlyRate);

	return {
		...security,
		value: newValue,
	};
}

export function getNextMonthRealEstateStep(re: StepRealEstate): StepRealEstate {
	const {
		value,
		estimated_apy,
		mortgage_value,
		mortgage_apy,
		mortgage_paid_monthly,
	} = re;

	// Order of operations matter. Banks want their money. So the mortage grows before the payment is subtracted.
	const mortgageMonthlyRate = mortgage_apy / 100 / 12;
	const mortgageValueAfterGrowth = mortgage_value * (1 + mortgageMonthlyRate);
	const newMortgageValue = Math.max(
		mortgageValueAfterGrowth - mortgage_paid_monthly,
		0,
	);

	// We don't "add" any value to the property for this calculation.
	const propertyMonthlyRate = estimated_apy / 100 / 12;
	const newPropertyValue = value * (1 + propertyMonthlyRate);

	return {
		...re,
		value: newPropertyValue,
		mortgage_value: newMortgageValue,
	};
}

function configNumberParse(obj: unknown): number {
	if (typeof obj !== "string") {
		return 0;
	}

	// Remove unwanted chars.
	const stripped = obj.replace(",", "");

	// Attempt parse. Use zero if parsing fails.
	const parsed = parseFloat(stripped);
	if (isNaN(parsed)) {
		return 0;
	} else {
		return parsed;
	}
}
