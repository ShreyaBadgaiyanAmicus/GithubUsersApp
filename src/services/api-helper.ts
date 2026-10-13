export async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      throw new Error(
        "GitHub API rate limit reached. Please try again later."
      );
    }

    if (response.status === 404) {
      throw new Error("The requested resource could not be found.");
    }

    throw new Error("Failed to fetch data from GitHub.");
  }

  return (await response.json()) as T;
}
