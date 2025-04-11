export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { email } = req.body;

    // Validación básica de email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Email no válido' });
    }

    try {
        const apiKey = 'Bearer eyJpdiI6Ik1qUXdNek0yTkRBME9URXhNRGM0TkE9PSIsInZhbHVlIjoiczNWcUlXWHdTVFJhUnY5aHBEMHJEQWtqU2RQeW5nZkt3NXEyaWw4MnByWT0iLCJtYWMiOiI2ZTE3NjEzMzhjODY3MzA4NWNkNjg1N2Y2NWM3OWI0MDdiZDMzYjA0MDFkNWIwMTU0ODY3OWI2NDQ2MTYzMzQ3In0=';

        // Paso 1: Crear el contacto
        const createContactResponse = await fetch('https://api.envialosimple.com/v2/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            },
            body: JSON.stringify({ Email: email })
        });

        if (!createContactResponse.ok) {
            const errorData = await createContactResponse.json();
            return res.status(createContactResponse.status).json({ message: 'Error al crear contacto', error: errorData });
        }

        const contactData = await createContactResponse.json();
        const contactId = contactData.Data.ID;

        // Paso 2: Agregar el contacto a la lista
        const listId = 9;
        const addToListResponse = await fetch(`https://api.envialosimple.com/v2/lists/${listId}/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            },
            body: JSON.stringify({ ContactID: contactId })
        });

        if (!addToListResponse.ok) {
            const errorData = await addToListResponse.json();
            return res.status(addToListResponse.status).json({ message: 'Error al agregar a la lista', error: errorData });
        }

        const listResponseData = await addToListResponse.json();

        return res.status(200).json({ message: 'Suscripción exitosa', data: listResponseData });

    } catch (error) {
        return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}
