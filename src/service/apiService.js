// apiService.js
export default class ApiService {
  constructor() {
    this.apiKey = process.env.REACT_APP_API_KEY;
    this.apiBase = process.env.REACT_APP_API_URL;
  }

  async getResource(url, options = {}) {

    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return res.json();
  }

  getAllComics(limit, offset, signal) {
    const url = `${this.apiBase}/api/issues/?api_key=${this.apiKey}&limit=${limit}&offset=${offset}&format=json`;
    return this.getResource(url, { signal });
  }

  getAllCharacters(offset, signal) {
    const url = `${this.apiBase}/api/characters/?api_key=${this.apiKey}&limit=6&offset=${offset}&format=json`;
    return this.getResource(url, { signal });
  }

  async getCharacter(id, signal) {
    const comicsOffset = Math.max(0, Math.floor(Math.random() * 100));

    const charUrl = `${this.apiBase}/api/character/4005-${id}/?api_key=${this.apiKey}&format=json`;
    const comicsUrl = `${this.apiBase}/api/issues/?filter=character:${id}&limit=10&offset=${comicsOffset}&api_key=${this.apiKey}&format=json`;

    const [charRes, comicsRes] = await Promise.all([
      this.getResource(charUrl, { signal }),
      this.getResource(comicsUrl, { signal }),
    ]);

    return this.transformCharacter(charRes?.results, comicsRes?.results);
  }

  transformCharacter(char, comics = []) {
    // В ComicVine results на /character обычно объект, а не массив.
    if (!char) return null;

    const DEFAULT_NAME = "Unnamed Hero";
    const DEFAULT_DESCRIPTION =
      "This hero prefers to keep a low profile. No official description is available — but the adventure continues.";
    const DEFAULT_IMG = "";
    const DEFAULT_URL = "#";

    const comicsChar = Array.isArray(comics)
      ? comics
          .filter(Boolean)
          .map((item) => ({
            id: item.id,
            name: item.name || item.volume?.name || "Unknown comic",
            image: item.image || null,
            url: item.site_detail_url || DEFAULT_URL,
          }))
      : [];

    return {
      id: char.id,
      name: char.name || DEFAULT_NAME,
      image: char.image?.medium_url || DEFAULT_IMG,
      description: char.deck || DEFAULT_DESCRIPTION,
      wiki: char.site_detail_url || DEFAULT_URL,
      home: char.site_detail_url || DEFAULT_URL,
      comicsChar,
    };
  }
}




// apiService.js
// export default class ApiService {
//   // Базовый URL для нашего прокси (тот же домен — same-origin, нет CORS)
//   proxyBase = '/api/comicvine';

//   async getResource(path, params = {}, signal) {
//     // Собираем URL: /api/comicvine?path=characters&limit=6&offset=0
//     const queryParams = new URLSearchParams({ path, ...params }).toString();
//     const url = `${this.proxyBase}?${queryParams}`;

//     const res = await fetch(url, { signal });

//     if (!res.ok) {
//       throw new Error(`Could not fetch ${url}, status: ${res.status}`);
//     }
//     return res.json();
//   }

//   getAllComics(limit, offset, signal) {
//     return this.getResource('issues', { limit, offset }, signal);
//   }

//   getAllCharacters(offset, signal) {
//     return this.getResource('characters', { limit: 6, offset }, signal);
//   }

//   async getCharacter(id, signal) {
//     const comicsOffset = Math.max(0, Math.floor(Math.random() * 100));

//     const [charRes, comicsRes] = await Promise.all([
//       this.getResource(`character/4005-${id}`, {}, signal),
//       this.getResource(
//         'issues',
//         {
//           filter: `character:${id}`,
//           limit: 10,
//           offset: comicsOffset,
//         },
//         signal
//       ),
//     ]);

//     return this.transformCharacter(charRes?.results, comicsRes?.results);
//   }

//   transformCharacter(char, comics = []) {
//     if (!char) return null;

//     const DEFAULT_NAME = 'Unnamed Hero';
//     const DEFAULT_DESCRIPTION =
//       "This hero prefers to keep a low profile. No official description is available — but the adventure continues.";
//     const DEFAULT_IMG = '';
//     const DEFAULT_URL = '#';

//     const comicsChar = Array.isArray(comics)
//       ? comics.filter(Boolean).map((item) => ({
//           id: item.id,
//           name: item.name || item.volume?.name || 'Unknown comic',
//           image: item.image || null,
//           url: item.site_detail_url || DEFAULT_URL,
//         }))
//       : [];

//     return {
//       id: char.id,
//       name: char.name || DEFAULT_NAME,
//       image: char.image?.medium_url || DEFAULT_IMG,
//       description: char.deck || DEFAULT_DESCRIPTION,
//       wiki: char.site_detail_url || DEFAULT_URL,
//       home: char.site_detail_url || DEFAULT_URL,
//       comicsChar,
//     };
//   }
// }