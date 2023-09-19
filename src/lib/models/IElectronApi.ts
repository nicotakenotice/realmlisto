import type { Realmlist } from './Realmlist';

// Preload script methods
export interface IElectronApi {
  getRealmlist$: () => Promise<Realmlist>
}

// Extend existing Window interface
declare global {
  interface Window {
    electronApi: IElectronApi
  }
}
