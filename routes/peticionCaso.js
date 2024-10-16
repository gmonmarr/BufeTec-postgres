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
    const { estado, id_abogado } = req.body;
    const estadosValidos = ['Aceptado', 'Negado', 'En proceso'];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Invalid estado value' });
    }

    const peticion = await PeticionCaso.findByPk(id);
    if (!peticion) {
      return res.status(404).json({ error: 'Petition not found' });
    }

    peticion.estado = estado;
    await peticion.save();

    if (estado === 'Aceptado') {
      if (!id_abogado) {
        return res.status(400).json({ error: 'id_abogado is required for cases in process' });
      }

      const cliente = await Cliente.create({
        id_usuario: peticion.id_user,
        direccion: null
      });

      const usuario = await Usuario.findByPk(peticion.id_user);
      if (usuario) {
        usuario.rol = 'Cliente';
        await usuario.save();
      }

      // Obtener el último caso creado y generar el próximo número de expediente
      const lastCaso = await Caso.findOne({
        order: [['id', 'DESC']]  // Obtener el último caso creado
      });

      const lastExpediente = lastCaso ? lastCaso.numero_expediente : null;
      const currentYear = new Date().getFullYear(); // Obtener el año actual

      let nextExpedienteNumber;

      if (lastExpediente) {
        // Extraer el número del expediente anterior (parte antes del guión)
        const [lastNumber] = lastExpediente.split('-').map(Number);
        nextExpedienteNumber = lastNumber + 1;  // Incrementar el número
      } else {
        nextExpedienteNumber = 1;  // Si no hay expedientes, empezar con 1
      }

      // Crear el nuevo número de expediente con el formato número-año
      const nuevoNumeroExpediente = `${nextExpedienteNumber}-${currentYear}`;

      // Crear el nuevo caso
      const nuevoCaso = await Caso.create({
        numero_expediente: nuevoNumeroExpediente,
        descripcion: peticion.descripcion,
        estado: 'Aceptado',
        id_abogado,
        id_cliente: cliente.id
      });

      return res.json({
        message: 'Petition updated, role changed, and case created successfully',
        peticion,
        cliente,
        nuevoCaso,
        usuario
      });
    }

    res.json({ message: 'Petition updated successfully', peticion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating petition' });
  }
});


module.exports = router;
