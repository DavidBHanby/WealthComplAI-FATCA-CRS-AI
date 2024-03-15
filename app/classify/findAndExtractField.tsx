'use client';
export const findAndExtractField = (fieldName: string, dataString: string) => {
  // Regex pattern to match the field name and its complete value, regardless of type
  // This pattern captures:
  // - Quoted field names
  // - Followed by optional spaces, a colon, and optional spaces
  // - The field value, which can be a quoted string, number, object, array, true, false, or null
  const regexPattern = new RegExp(`"${fieldName}"\\s*:\\s*((".*?"|\\d+(\\.\\d+)?|true|false|null|\\[.*?\\]|\\{.*?\\}))\\s*(,|}$)`, 's');
  const match = regexPattern.exec(dataString);

  if (match && match[1]) {
    // Extracted value
    let value = match[1].trim();

    // Attempt to parse the extracted value to handle strings, numbers, booleans, nulls, arrays, and objects
    try {
      value = JSON.parse(value);
      console.log(value, ' < value 1 ... and value type = ', typeof value)
    } catch (e) {
      // If parsing fails, it could be due to malformed JSON or incomplete streaming. Since we're focusing on complete data, this case should be rare.
      console.error('Failed to parse field value:', e);
      return { value: null, newData: dataString };
    }

    // Remove the matched portion from the data string to avoid reprocessing
    let newData = ''
    try {
      newData = dataString.substring(0, match.index) + dataString.substring(match.index + match[0].length);
    } catch {
      newData = ''
    }

    return { value, newData };
  }

  // If no complete field is found, return null value and original data
  return { value: null, newData: dataString };
};
