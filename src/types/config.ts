export type Config = {
	securities: InputSecurity[];
	real_estate: InputRealEstate[];
};

export type InputSecurity = {
	id: string;
	name: string;
	value: string;
	estimated_apy: string;
};

export type InputRealEstate = {
	id: string;
	name: string;
	value: string;
	estimated_apy: string;
	mortgage_value: string;
	mortgage_apy: string;
};
