/** This config is what the user has control over using form controls. Records the initial state. */
export type InputConfig = {
	securities: InputSecurity[];
	real_estate: InputRealEstate[];
};

export type InputSecurity = {
	id: string;
	name: string;
	value: string;
	estimated_apy: string;
	added_monthly: string;
};

export type InputRealEstate = {
	id: string;
	name: string;
	value: string;
	estimated_apy: string;
	mortgage_value: string;
	mortgage_apy: string;
	mortgage_paid_monthly: string;
};

/** We use this parsed config to step through time and alter values from the initial config. */
export type StepConfig = {
	securities: StepSecurity[];
	real_estate: StepRealEstate[];
};

export type StepSecurity = {
	id: string;
	name: string;
	value: number;

	/** Formatted as a percentage. So we store `6` here which is `6%`. */
	estimated_apy: number;
	added_monthly: number;
};

export type StepRealEstate = {
	id: string;
	name: string;
	value: number;
	estimated_apy: number;
	mortgage_value: number;
	mortgage_apy: number;
	mortgage_paid_monthly: number;
};
