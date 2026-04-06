import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { townName, salary, deposit } = await request.json();

  if (!townName) {
    return NextResponse.json({ error: 'townName is required' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
  }

  const buyingPower = Math.round((salary * 4.5 + deposit) / 1000);

  const prompt = `You are researching "${townName}" as a London commuter town for Adam and Simon, a same-sex couple relocating from Norwich. They have a dog named Scarlet, want good green space, a welcoming LGBT+ community, good food scene, 2-3 bed house, and safety matters to them. Current salary £${salary.toLocaleString()}, buying power ~£${buyingPower}k.

Use web search to find current 2025/2026 data. Return ONLY raw JSON — absolutely no markdown, no backticks, no explanation:

{
  "name": "Official town name",
  "county": "County or borough",
  "lat": 51.5,
  "lng": -0.1,
  "baseStatus": "recommended",
  "commute": { "time": "35 min", "timeMin": 35, "terminal": "King's Cross", "line": "Train operator", "freq": "Every X min peak" },
  "seasonTicket": { "annual": 4500 },
  "costs": { "buyLow": 380000, "buyHigh": 460000, "rentLow": 1600, "rentHigh": 1900 },
  "lastTrain": { "departs": "23:31", "arrives": "00:09", "note": "Brief note on the service — operator, line, and what the departure time means practically for a night out" },
  "crime": {
    "force": "Police force name",
    "overallVsNational": -10,
    "burglaryVsNational": -15,
    "lgbtRisk": "lower",
    "lgbtNote": "Brief note on LGBT+ hate crime risk and community in this area",
    "positives": ["Safety positive 1", "Safety positive 2"],
    "concerns": ["Any specific concern"],
    "source": "CrimeRate.co.uk / police.uk data [year]"
  },
  "lifestyle": {
    "dogWalking": 4, "dogWalkingNotes": "specific parks and walks",
    "dining": 3, "diningNotes": "food scene description",
    "shopping": 3, "shoppingNotes": "shopping description",
    "character": 4, "characterNotes": "town character"
  },
  "recommendation": "2-3 sentences covering commute, property value, safety, LGBT+ welcome, and dog walking for Scarlet specifically",
  "pois": [
    {"name": "Station", "lat": 51.5, "lng": -0.1, "type": "transport", "desc": "service details"},
    {"name": "Park or walk", "lat": 51.5, "lng": -0.1, "type": "walk", "desc": "details"},
    {"name": "Cafe or restaurant", "lat": 51.5, "lng": -0.1, "type": "eat", "desc": "details"},
    {"name": "Shopping area", "lat": 51.5, "lng": -0.1, "type": "shop", "desc": "details"},
    {"name": "Landmark", "lat": 51.5, "lng": -0.1, "type": "culture", "desc": "details"}
  ]
}

Rules:
- baseStatus: "recommended" (commute ≤45 min AND semi £300-520k) | "borderline" (commute 40-55 or price £500-650k) | "future" (price >£650k or commute >55 min)
- terminal: King's Cross | Paddington | Liverpool Street | Euston | Marylebone | Waterloo | Victoria | London Bridge
- lastTrain.departs: actual last departure time from the London terminal on weekday evenings (prefix with ~ if approximate). Times after midnight should be shown as e.g. "00:46" not "12:46am"
- crime.overallVsNational and burglaryVsNational: % vs national average (negative=safer), e.g. -14 means 14% below national
- crime.lgbtRisk: "lower" | "similar" | "higher"
- all lat/lng must be accurate UK coordinates
- Return raw JSON only`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const e = await response.json().catch(() => ({}));
      throw new Error(e.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    const fullText = (data.content || [])
      .map((b: { type: string; text?: string }) => (b.type === 'text' ? b.text : ''))
      .join('');

    const match = fullText.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error(`No data found for "${townName}". Check spelling or try a nearby town.`);
    }

    const parsed = JSON.parse(match[0]);
    if (!parsed.name || !parsed.commute || !parsed.costs) {
      throw new Error(`Incomplete data for "${townName}". Try a different name.`);
    }

    // Add a unique id
    const location = {
      ...parsed,
      id: parsed.name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now(),
    };

    return NextResponse.json(location);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
