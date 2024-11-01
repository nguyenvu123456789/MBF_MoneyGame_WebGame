export interface IResponsePage<T = any>{
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
  content: T[];
  sortings?: {
    direction?: number;
    field?: string;
  }[];
  searchParams?: object;
}
