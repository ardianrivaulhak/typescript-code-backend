export interface ITableData<T> {
  page: number;
  limit: number;
  search: string;
  totalPages: number;
  totalRows: number;
  nextPages: number;
  prevPages: number;
  data: T[];
}

export class TableData<T> {
  private props: ITableData<T>;
  constructor(props: ITableData<T>) {
    this.props = props;
  }
  static create<T>(props: ITableData<T>): TableData<T> {
    return new TableData<T>(props);
  }
  unmarshal(): ITableData<T> {
    return {
      page: this.page,
      limit: this.limit,
      search: this.search,
      totalPages: this.totalPages,
      totalRows: this.totalRows,
      nextPages: this.nextPages,
      prevPages: this.prevPages,
      data: this.data,
    };
  }
  get page(): number {
    return this.props.page;
  }
  get limit(): number {
    return this.props.limit;
  }
  get search(): string {
    return this.props.search;
  }

  get totalPages(): number {
    return this.props.totalPages;
  }

  get totalRows(): number {
    return this.props.totalRows;
  }

  get nextPages(): number {
    return this.props.nextPages;
  }

  get prevPages(): number {
    return this.props.prevPages;
  }

  get data(): T[] {
    return this.props.data;
  }
}
