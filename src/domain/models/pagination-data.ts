interface IPaginate {
    page: number;
    limit: number;
    totalPages: number;
    totalRows: number;
    nextPages: number;
    prevPages: number;
}
export interface IPaginationData<T> {
    pagination: IPaginate;
    data: T[];
}
export class PaginationData<T> {
    private props: IPaginationData<T>;
    constructor(props: IPaginationData<T>) {
        this.props = props;
    }
    static create<T>(props: IPaginationData<T>): PaginationData<T> {
        return new PaginationData<T>(props);
    }
    unmarshal(): IPaginationData<T> {
        return {
            pagination: {
                page: this.page,
                limit: this.limit,
                totalPages: this.totalPages,
                totalRows: this.totalRows,
                nextPages: this.nextPages,
                prevPages: this.prevPages,
            },
            data: this.data
        };
    }
    get page(): number {
        return this.props.pagination.page;
    }
    get limit(): number {
        return this.props.pagination.limit;
    }
    get totalPages(): number {
        return this.props.pagination.totalPages;
    }
    get totalRows(): number {
        return this.props.pagination.totalRows;
    }
    get nextPages(): number {
        return this.props.pagination.nextPages;
    }
    get prevPages(): number {
        return this.props.pagination.prevPages;
    }
    get data(): T[] {
        return this.props.data;
    }
}
