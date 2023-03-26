export default async function modFetch(url, options) {
  const response = await fetch(url, options);

  if (response.status === 200) {
    const result = await response.json();

    // misal ada error meskipun 200
    if (result.error) {
      throw new Error("Unexpected Error Occurred");
    }

    return result;
  }

  // selain 200
  throw new Error(`Error: ${response.status} - ${response.statusText}`);
}
