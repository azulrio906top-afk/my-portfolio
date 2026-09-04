import { NextResponse } from "next/server";

export function apiSuccess<T>(
    data: T,
    status = 200,
) {
    return NextResponse.json(
        {
            success: true,
            data,
        },
        { status },
    );
}

export function apiError(
    message: string,
    status = 500,
    details?: unknown,
) {
    return NextResponse.json(
        {
            success: false,
            error: message,
            ...(details !== undefined
                ? { details }
                : {}),
        },
        { status },
    );
}