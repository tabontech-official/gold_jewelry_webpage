import type {
  ProductFilter,
  ProductCollectionSortKeys,
} from '@shopify/hydrogen/storefront-api-types';

export type SortOption = {
  label: string;
  value: string;
  sortKey: ProductCollectionSortKeys;
  reverse: boolean;
};

export const SORT_OPTIONS: SortOption[] = [
  {label: 'Featured', value: 'featured', sortKey: 'COLLECTION_DEFAULT', reverse: false},
  {label: 'Most relevant', value: 'relevant', sortKey: 'COLLECTION_DEFAULT', reverse: false},
  {label: 'Best Selling', value: 'best-selling', sortKey: 'BEST_SELLING', reverse: false},
  {label: 'Alphabetically, A–Z', value: 'title-asc', sortKey: 'TITLE', reverse: false},
  {label: 'Alphabetically, Z–A', value: 'title-desc', sortKey: 'TITLE', reverse: true},
  {label: 'Price, low to high', value: 'price-asc', sortKey: 'PRICE', reverse: false},
  {label: 'Price, high to low', value: 'price-desc', sortKey: 'PRICE', reverse: true},
  {label: 'Date, old to new', value: 'date-asc', sortKey: 'CREATED', reverse: false},
  {label: 'Date, new to old', value: 'date-desc', sortKey: 'CREATED', reverse: true},
];

export function getSortFromParam(sort?: string | null): SortOption {
  return SORT_OPTIONS.find((option) => option.value === sort) ?? SORT_OPTIONS[0];
}

/** Every active facet is stored as a JSON-encoded `filter` search param. */
export function getFiltersFromParam(searchParams: URLSearchParams): ProductFilter[] {
  const filters: ProductFilter[] = [];
  for (const value of searchParams.getAll('filter')) {
    try {
      // every facet has sidebar UI now, price slider included
      filters.push(JSON.parse(value) as ProductFilter);
    } catch {
      // ignore malformed filter params
    }
  }
  return filters;
}
