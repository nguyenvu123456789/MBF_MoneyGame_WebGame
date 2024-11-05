export interface PageData<T> {
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    data: T[];
    sortings: {
      direction: number;
      field: string;
    }[];
    searchParams?: object;
  }
  
  export interface ISort {
    direction: number;
    field: string;
  }
  
  export interface PageSearchRequest<T> {
    pageIndex?: number;
    pageSize?: number;
    filtering?: T;
    sorting: ISort;
    paginated?: boolean;
  }
  