import type { SOURCE } from '$lib/enums';
import type { Realmlist } from './Realmlist';

// Preload script methods
export interface IElectronApi {
  getRealmlist$: (source: SOURCE) => Promise<Realmlist>
}

// Extend existing Window interface
declare global {
  interface Window {
    electronApi: IElectronApi
  }
}
