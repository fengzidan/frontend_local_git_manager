declare interface tableOptionItem {
  prop: string;
  label: string;
  width?: string | number;
  align?: "center" | "left" | "right";
  sortable?: boolean;
  checked: boolean;
}

declare interface tableSortOption {
  prop: string;
  order: null | "ascending" | "descending";
}
