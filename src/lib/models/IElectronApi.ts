import type { REALMLIST_SOURCE } from '$lib/enums';
import type { Realmlist } from './Realmlist';

// Preload script methods
export interface IElectronApi {
  getRealmlist$: (source: REALMLIST_SOURCE) => Promise<Realmlist>
}

// Extend existing Window interface
declare global {
  interface Window {
    electronApi: IElectronApi
  }
}
