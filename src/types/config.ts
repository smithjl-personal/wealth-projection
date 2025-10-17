export type Config = {
	securities: Security[];
	real_estate: RealEstate[];
};

export type Security = {
	id: string;
	name: string;
	value: string;
	estimated_apy: string;
};

export type RealEstate = {
	id: string;
	name: string;
	value: string;
	estimated_apy: string;
	mortgage_value: string;
	mortgage_apy: string;
};
