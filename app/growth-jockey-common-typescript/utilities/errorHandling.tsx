// export type Result<T, U = Error> = {
//     ok: T;
//     err: null;
// } | {
//     ok: null;
//     err: U;
// };

export type OkResult<T> = {
    success: true;
    ok: T;
};

export type ErrResult<T> = {
    success: false;
    err: Error;
};

export type Result<T> = OkResult<T> | ErrResult<T>;

export function okResult<T>(ok: T): OkResult<T> {
    return {
        success: true,
        ok: ok,
    };
}

export function errResult<T>(err: Error): ErrResult<T> {
    return {
        success: false,
        err: err,
    };
}
