export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    const { email } = req.body;

console.log('MÉTODO:', req.method);
console.log('HEADERS:', req.headers);
console.log('BODY RECIBIDO:', req.body);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Email no válido' });
    }

    const apiKey = 'Bearer eyJpdiI6Ik1qUXdNek0yTkRBME9URXhNRGM0TkE9PSIsInZhbHVlIjoiczNWcUlXWHdTVFJhUnY5aHBEMHJEQWtqU2RQeW5nZkt3NXEyaWw4MnByWT0iLCJtYWMiOiI2ZTE3NjEzMzhjODY3MzA4NWNkNjg1N2Y2NWM3OWI0MDdiZDMzYjA0MDFkNWIwMTU0ODY3OWI2NDQ2MTYzMzQ3In0=';
    const listId = 9;

    try {
        // Crear contacto
        const createContactResponse = await fetch('https://api.envialosimple.com/v2.0/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            },
            body: JSON.stringify({ Email: email })
        });

        const createContactData = await createContactResponse.json();
        console.log('Respuesta de creación de contacto:', createContactData);

        if (!createContactResponse.ok) {
            return res.status(createContactResponse.status).json({
                message: 'Error al crear contacto',
                error: createContactData
            });
        }

        const contactId = createContactData.Data?.ContactID;

        if (!contactId) {
            return res.status(500).json({ message: 'No se obtuvo el ContactID', response: createContactData });
        }

        // Agregar contacto a la lista
        const addToListResponse = await fetch(`https://api.envialosimple.com/v2.0/lists/${listId}/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            },
            body: JSON.stringify({ ContactID: contactId })
        });

        const addToListData = await addToListResponse.json();
        console.log('Respuesta de agregar a la lista:', addToListData);

        if (!addToListResponse.ok) {
            return res.status(addToListResponse.status).json({
                message: 'Error al agregar a la lista',
                error: addToListData
            });
        }

        return res.status(200).json({ message: 'Suscripción exitosa', data: addToListData });

    } catch (error) {
        console.error('Error general:', error);
        return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
}
