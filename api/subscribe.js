export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Acá iría tu integración con EnvialoSimple
  // Por ahora devolvemos una respuesta de prueba
  return res.status(200).json({ message: `Email recibido: ${email}` });
}
