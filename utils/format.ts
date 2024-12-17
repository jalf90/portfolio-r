// Function to convert Unix timestamp to "Day Month Date" format
export function formatDay(unixTimestamp: number, country: string) {
  // Convert Unix timestamp (in seconds) to milliseconds
  const date = new Date(unixTimestamp * 1000);

  // Options for toLocaleDateString
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };

  // Format the date to "Tue Dec 17"
  return date.toLocaleDateString(country, options);
}
