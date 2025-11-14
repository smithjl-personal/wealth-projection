/* Tell TypeScript that <font-awesome-icon> is a global component */
declare module "vue" {
	export interface GlobalComponents {
		FontAwesomeIcon: typeof import("@fortawesome/vue-fontawesome").FontAwesomeIcon;
	}
}

export {};
