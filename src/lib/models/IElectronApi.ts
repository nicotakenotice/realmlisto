import type { REALMLIST_SOURCE } from '$lib/enums';
import type { RealmlistFile } from './RealmlistFile';
import type { Realmlist } from './Realmlist';

// Preload script methods
export interface IElectronApi {
  getRealmlist$: (source: REALMLIST_SOURCE) => Promise<RealmlistFile>,
  getRealmlists$: () => Promise<Realmlist[]>,
  saveRealmlists$: (realmlists: Realmlist[]) => Promise<Realmlist[]>,
  setRealmlist$: (realmlist: Realmlist) => Promise<RealmlistFile>
}

// Extend existing Window interface
declare global {
  interface Window {
    electronApi: IElectronApi
  }
}
