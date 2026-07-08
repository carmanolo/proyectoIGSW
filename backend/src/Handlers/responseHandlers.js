"use strict";

import { SHOW_ERRORS, DEFAULT_ERROR } from "../constants/settings.constants.js";

export const handleSuccess = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    message,
    data,
    status: "Success",
  });
};

export const handleErrorClient = (res, statusCode, message, errorDetails = null) => {
  res.status(Number(statusCode)).json({
    message,
    errorDetails,
    status: "Client error",
  });
};

export const handleErrorServer = (res, statusCode, message, errorDetails = null, err = DEFAULT_ERROR) => {
  if (SHOW_ERRORS) {
    console.error("Error completo: ", err);
  }
  console.error("Server Error:", message, errorDetails);
  res.status(statusCode).json({
    message,
    errorDetails,
    status: "Server error",
  });
};