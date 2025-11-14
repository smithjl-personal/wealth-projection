// TODO: Type this further if needed.
export interface ApexTooltipContext {
	globals: {
		seriesNames: string[];
		seriesX: number[][];
		seriesY: number[][];
		labels: (string | number)[];
		maxY: number;
		minY: number;
		colors: string[];
	};
}
