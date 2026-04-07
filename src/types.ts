export interface TorrentProvider {
  name: string;
  url: string;
  isEnabled: boolean;
  isCustom: boolean;
}

export interface TorrentResult {
  title: string;
  size: string;
  seeds: number;
  leeches: number;
  category: string;
  source: string;
  magnetUrl: string;
  uploadDate: string; // ISO string or similar
  quality?: string;
}

export type AppTheme = 'Dark' | 'Light' | 'Auto';

export interface AppSettings {
  theme: AppTheme;
  trueBlack: boolean;
  autoUpdateUrls: boolean;
  hideNoSeeders: boolean;
  hideNoResults: boolean;
  hideAdult: boolean;
  searchTimeout: number;
}

export const DEFAULT_PROVIDERS: TorrentProvider[] = [
  { name: "1337X", url: "https://1337x.to", isEnabled: true, isCustom: false },
  { name: "YIFY", url: "https://yts.mx", isEnabled: true, isCustom: false },
  { name: "TPB", url: "https://thepiratebay.org", isEnabled: true, isCustom: false },
  { name: "TorrentGalaxy", url: "https://torrentgalaxy.to", isEnabled: true, isCustom: false },
  { name: "LimeTorrents", url: "https://limetorrents.info", isEnabled: true, isCustom: false },
  { name: "EZTV", url: "https://eztv.re", isEnabled: true, isCustom: false },
  { name: "KickassTorrents", url: "https://kickasstorrents.to", isEnabled: true, isCustom: false },
  { name: "Nyaa", url: "https://nyaa.si", isEnabled: true, isCustom: false },
];
