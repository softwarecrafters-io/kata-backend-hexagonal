export interface HttpRequest<T> {
    body: T;
}

export interface HttpResponse<T> {
    status(code: number): this;
    json(data: T | { message: string }): this;
}
