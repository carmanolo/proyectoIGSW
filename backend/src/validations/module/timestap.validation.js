export const timestampValidationHelper = (timestamp) => {
    try {
        if (!timestamp) {
            return false;
        }
        if (typeof(timestamp) !== "string") {
            return false;
        }
        timestamp = timestamp.split(".")[0];
        const result = Date.parse(timestamp, "yyyy-MM-dd HH:mm:ss");
        if (result === null || !result) {
            return false;
        }        
    } catch (error) {
        console.error(error);
        return false;
    }

    return true;
}

export const timeValidationHelper = (time) => {
    if (!time || typeof(time) !== "string") {
        return false;
    }
    return timestampValidationHelper(String(time) + " 00:00:00");
}

export const timestampValidationFunction = (value, helpers) => {
    const result = timestampValidationHelper(value);
    if (!result) {
        return helpers.message('La fecha no es válida');
    }
    return true;
}

export const timeValidationFunction = (value, helpers) => {
    const result = timeValidationHelper(value);
    if (!result) {
        return helpers.message('La fecha no es válida');
    }
    return true;
}