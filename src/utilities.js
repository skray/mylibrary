export const extractAPIErrorMessage = (error) => {
  if (error.response) {
    return error.response.data ? error.response.data.message : error.response.data;
  } else if (error.request) {
    return "Error: could not make http request";
  } else {
    return error.message;
  }
}