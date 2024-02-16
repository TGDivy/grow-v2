import { AxiosError } from "axios";

export class APIError extends Error {
  status: number;
  data: unknown;
  name: string;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "APIError";
  }
}

//  API Errors

//  Network Error
export class NetworkError extends APIError {
  constructor(message: string, data: unknown) {
    super(message, 0, data);
    this.name = "NetworkError";
  }
}

// 404  Not Found Error
export class NotFoundError extends APIError {
  constructor(message: string, data: unknown) {
    super(message, 404, data);
    this.name = "NotFoundError";
  }
}

// 401  Not Authorized Error
export class NotAuthorizedError extends APIError {
  constructor(message: string, data: unknown) {
    super(message, 401, data);
    this.name = "NotAuthorizedError";
  }

  redirect() {
    // Redirect the user
  }
}

// 400 Bad Request Error
export class BadRequestError extends APIError {
  constructor(message: string, data: unknown) {
    super(message, 400, data);
    this.name = "BadRequestError";
  }
}

//   422 Unprocessable Entity Error
export class UnprocessableEntityError extends APIError {
  constructor(message: string, data: unknown) {
    super(message, 422, data);
    this.name = "UnprocessableEntityError";
  }
}

// 405 Method Not Allowed Error
export class MethodNotAllowedError extends APIError {
  constructor(message: string, data: unknown) {
    super(message, 405, data);
    this.name = "MethodNotAllowedError";
  }
}

// 500+ Server Error
export class ServerError extends APIError {
  constructor(message: string, status: number, data: unknown) {
    super(message, status, data);
    this.name = "InternalServerError";
  }
}

export const handleAxiosError = (error: AxiosError) => {
  if (!(error instanceof Error)) {
    throw new Error("Unknown error occurred.");
  }
  if (!("response" in error)) {
    throw new NetworkError("Network error occurred.", null);
  }

  if (error.response) {
    const { status, data } = error.response;
    if (status === 400) {
      throw new BadRequestError("Bad request.", data);
    }
    if (status === 401) {
      throw new NotAuthorizedError("Unauthorized.", data);
    }
    if (status === 404) {
      throw new NotFoundError("Not found.", data);
    }
    if (status === 405) {
      throw new MethodNotAllowedError("Method not allowed.", data);
    }
    if (status === 422) {
      throw new UnprocessableEntityError("Unprocessable entity.", data);
    }
    if (status >= 500) {
      throw new ServerError("Server error occurred.", status, data);
    }
    throw new APIError("API error occurred.", status, data);
  }
};
