export const BASE_CASE = 500;
export const BASE_LENGTH = 0;
export const OBJECT_LENGTH = 1;
export const MIN_ERROR_CODE = 100;
export const MAX_ERROR_CODE = 600;

export const getErrorMessage = (error) => {
    if (!error) {
        return UNKNOWN_ERROR;
    }
    return error.message ? error.message : UNKNOWN_ERROR; 
}

export const getResultLength = (result) => {
    if (!result) {
        return BASE_LENGTH;
    }
    try {
        if (Array.isArray(result)) {
            return Number(result.length);
        }
        return OBJECT_LENGTH;
    } catch (error) {
        console.error(error);
        return BASE_LENGTH;
    }
}


export const getServiceResult = (error, data, details, length) => {
    return {
        error: Boolean(error),
        data: Object(data),
        details: String(details || "Error desconocido"),
        length: parseInt(length || 0)
    };
}
