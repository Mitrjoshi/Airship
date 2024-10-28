interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export const createResponse = <T>(
  success: boolean,
  message: string,
  data?: T,
  errors?: any
): ApiResponse<T> => {
  return { success, message, data, errors };
};
