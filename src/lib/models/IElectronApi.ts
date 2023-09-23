import type { REALMLIST_SOURCE } from '$lib/enums';
import type { Realmlist } from './Realmlist';
import type { RealmlistEntry } from './RealmlistEntry';

// Preload script methods
export interface IElectronApi {
  getRealmlist$: (source: REALMLIST_SOURCE) => Promise<Realmlist>,
  getRealmlists$: () => Promise<RealmlistEntry[]>,
  saveRealmlists$: (realmlists: RealmlistEntry[]) => Promise<RealmlistEntry[]>
}

// Extend existing Window interface
declare global {
  interface Window {
    electronApi: IElectronApi
  }
}
