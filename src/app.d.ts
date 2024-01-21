// See https://kit.svelte.dev/docs/types#app

import type { Session } from "$lib/services/session";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			metadata?: Record<string, any>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
