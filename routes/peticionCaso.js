const express = require('express');
const router = express.Router();
const PeticionCaso = require('../model/PeticionCaso');
const Cliente = require('../model/Cliente');
const Caso = require('../model/Caso');
const Usuario = require('../model/Usuario');
const verifyToken = require('../middleware/auth'); // Verificar JWT

// Crear una nueva petición
router.post('/', verifyToken(), async (req, res) => {
  try {
    const { descripcion } = req.body;
    const userId = req.user.id;

    const nuevaPeticion = await PeticionCaso.create({
      id_user: userId,
      descripcion,
    });

    res.status(201).json(nuevaPeticion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating petition' });
  }
});

// Obtener todas las peticiones
router.get('/', verifyToken(['Alumno', 'Abogado', 'Admin']), async (req, res) => {
  try {
    // Utilizamos el include para unir con la tabla de Usuario y obtener el nombre y email
    const peticiones = await PeticionCaso.findAll({
      include: {
        model: Usuario,
        attributes: ['nombre', 'email'] // Seleccionamos los campos que queremos del usuario
      }
    });

    // Formateamos la respuesta para incluir los datos relevantes
    const formattedPeticiones = peticiones.map(peticion => ({
      id: peticion.id,
      descripcion: peticion.descripcion,
      estado: peticion.estado,
      createdAt: peticion.createdAt,
      updatedAt: peticion.updatedAt,
      usuario: {
        nombre: peticion.Usuario.nombre,
        email: peticion.Usuario.email
      }
    }));

    res.json(formattedPeticiones); // Enviamos la respuesta formateada
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching petitions' });
  }
});

// Modificar el estado de una petición
router.put('/:id', verifyToken(['Alumno', 'Abogado', 'Admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, id_abogado } = req.body; // Recibimos el estado e id_abogado
    const estadosValidos = ['Aceptado', 'Negado', 'En proceso'];

    // Verificar que el estado sea válido
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Invalid estado value' });
    }

    // Buscar la petición por su ID
    const peticion = await PeticionCaso.findByPk(id);
    if (!peticion) {
      return res.status(404).json({ error: 'Petition not found' });
    }

    // Actualizar el estado de la petición
    peticion.estado = estado;
    await peticion.save();

    // Si el estado es "Aceptado", crear un cliente y un caso
    if (estado === 'Aceptado') {
      // Verificar que se haya enviado el id_abogado
      if (!id_abogado) {
        return res.status(400).json({ error: 'id_abogado is required for cases in process' });
      }

      // Crear un cliente asociado al usuario de la petición
      const cliente = await Cliente.create({
        id_usuario: peticion.id_user,  // Asociamos el cliente al usuario que hizo la petición
        direccion: null // Direccion no provista
      });

      // Actualizar el rol del usuario a "Cliente"
      const usuario = await Usuario.findByPk(peticion.id_user);
      if (usuario) {
        usuario.rol = 'Cliente';
        await usuario.save();
      }

      // Generar el número de expediente disponible
      const lastCaso = await Caso.findOne({
        order: [['id', 'DESC']]  // Obtener el último caso creado
      });

      const lastExpediente = lastCaso ? lastCaso.numero_expediente : 'EXP000';
      const nextExpedienteNumber = parseInt(lastExpediente.replace('EXP', '')) + 1;
      const nuevoNumeroExpediente = `EXP${nextExpedienteNumber.toString().padStart(3, '0')}`;

      // Crear el nuevo caso
      const nuevoCaso = await Caso.create({
        numero_expediente: nuevoNumeroExpediente,
        descripcion: peticion.descripcion,  // Usamos la descripción de la petición
        estado: 'Aceptado',
        id_abogado,  // Asignamos el abogado pasado en el cuerpo
        id_cliente: cliente.id  // Asociamos el caso al cliente recién creado
      });

      return res.json({
        message: 'Petition updated, role changed, and case created successfully',
        peticion,
        cliente,
        nuevoCaso,
        usuario // Devolvemos el usuario actualizado con el nuevo rol
      });
    }

    // Si no se crea un caso, solo devolver la petición actualizada
    res.json({ message: 'Petition updated successfully', peticion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating petition' });
  }
});

module.exports = router;
