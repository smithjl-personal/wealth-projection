/**
 * Given anything, attempts to parse it using `parseFloat`. If unable to parse, returns zero.
 * @param obj Anything.
 * @returns The item passed through `parseFloat`. If result is NaN, returns zero.
 */
export function zeroIfNaN(obj: unknown): number {
	if (typeof obj !== "string") {
		return 0;
	}

	const parsed = parseFloat(obj);
	if (isNaN(parsed)) {
		return 0;
	} else {
		return parsed;
	}
}
