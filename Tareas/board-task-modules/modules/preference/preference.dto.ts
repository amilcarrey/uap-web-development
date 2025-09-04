export interface PreferenceDto {
  itemsPerPage: number;
  upperCase: boolean;
  updateInterval: number;
}

export interface UpdatePreferenceDto {
  itemsPerPage?: number;
  upperCase?: boolean;
  updateInterval?: number;
}
