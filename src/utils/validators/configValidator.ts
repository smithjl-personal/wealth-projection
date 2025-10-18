import type {
	Config,
	InputRealEstate,
	InputSecurity,
} from "../../types/config";

export function isConfig(obj: unknown): obj is Config {
	if (
		!obj ||
		typeof obj !== "object" ||
		!Array.isArray((obj as Config).securities) ||
		!Array.isArray((obj as Config).real_estate)
	) {
		return false;
	}

	const cfg = obj as Config;

	return (
		cfg.securities.every(
			(sec: InputSecurity) =>
				typeof sec.name === "string" &&
				typeof sec.value === "string" &&
				typeof sec.estimated_apy === "string",
		) &&
		cfg.real_estate.every(
			(re: InputRealEstate) =>
				typeof re.name === "string" &&
				typeof re.value === "string" &&
				typeof re.estimated_apy === "string" &&
				typeof re.mortgage_value === "string" &&
				typeof re.mortgage_apy === "string",
		)
	);
}
