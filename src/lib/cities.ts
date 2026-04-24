export type City = {
  name: string;
  country: string;
  lat: number;
  lng: number;
  tz: string;
};

let cache: City[] | null = null;

async function loadCities(): Promise<City[]> {
  if (cache) return cache;
  const res = await fetch("/data/cities.json");
  cache = (await res.json()) as City[];
  return cache;
}

export async function searchCities(query: string): Promise<City[]> {
  if (!query || query.length < 2) return [];
  const cities = await loadCities();
  const q = query.toLowerCase();
  const results: City[] = [];
  for (const city of cities) {
    if (city.name.toLowerCase().startsWith(q)) {
      results.push(city);
      if (results.length >= 10) break;
    }
  }
  if (results.length < 10) {
    for (const city of cities) {
      if (city.name.toLowerCase().includes(q) && !results.includes(city)) {
        results.push(city);
        if (results.length >= 10) break;
      }
    }
  }
  return results;
}
