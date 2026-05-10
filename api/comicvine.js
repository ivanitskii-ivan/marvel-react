export default async function handler(req, res) {
  // Получаем параметры из запроса браузера
  const { path, ...params } = req.query;
  
  if (!path) {
    return res.status(400).json({ error: 'Missing "path" parameter' });
  }

  // Собираем URL для Comic Vine
  const apiKey = process.env.COMICVINE_API_KEY;
  const baseUrl = 'https://comicvine.gamespot.com/api';
  
  // Превращаем параметры в query string: characters?limit=6&offset=0
  const queryString = new URLSearchParams({
    ...params,
    api_key: apiKey,
    format: 'json',
  }).toString();
  
  const fullUrl = `${baseUrl}/${path}/?${queryString}`;

  try {
    const response = await fetch(fullUrl, {
      headers: {
        // Comic Vine иногда требует User-Agent
        'User-Agent': 'Marvel-Portal/1.0',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Comic Vine returned ${response.status}` 
      });
    }

    const data = await response.json();
    
    // Кешируем ответ на 5 минут (опционально, но полезно)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: 'Failed to fetch from Comic Vine' });
  }
}