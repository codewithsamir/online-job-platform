// Function to convert data to an array (if it's an object)
export const checkArray = (data:any) => {
    // Check if data is an object and not an array
    if (typeof data === "object" && !Array.isArray(data)) {
      // Convert object to an array of key-value pairs
      return [data];
    }
    // If data is already an array, return it as-is
    return data;
  };