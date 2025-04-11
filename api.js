export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  const apiKey = process.env.ENVIALO_API_KEY;
  const listId = process.env.LIST_ID;

  try {
    const response = await fetch('https://api.envialosimple.com/v2/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        Email: email,
        ListID: listId,
        Confirmed: true
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ error: 'Failed to add subscriber' });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
