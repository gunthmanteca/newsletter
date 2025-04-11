export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Email no válido' });
    }

    const apiKey = 'Bearer eyJpdiI6Ik1qUXdNek0yTkRBME9URXhNRGM0TkE9PSIsInZhbHVlIjoiczNWcUlXWHdTVFJhUnY5aHBEMHJEQWtqU2RQeW5nZkt3NXEyaWw4MnByWT0iLCJtYWMiOiI2ZTE3NjEzMzhjODY3MzA4NWNkNjg1N2Y2NWM3OWI0MDdiZDMzYjA0MDFkNWIwMTU0ODY3OWI2NDQ2MTYzMzQ3In0=';

    const listId = 9;

    try {
        const response = await fetch('https://api.esmsv.com/v1/contacts/suscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            },
            body: JSON.stringify({
                listId,
                contacts: [{ email }]
            })
        });

        const data = await response.json();
        console.log('Respuesta de la API:', data);

        if (!response.ok) {
            return res.status(response.status).json({
                message: 'Error al suscribir contacto',
                error: data
            });
        }

        return res.status(200).json({ message: 'Suscripción exitosa', data });

    } catch (error) {
        console.error('Error general:', error);
        return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}
