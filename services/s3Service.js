// Importar módulos específicos desde AWS SDK v3
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Configuración del cliente de S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Función para subir archivo a S3
const uploadToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.name, // El nombre del archivo ahora incluye el user_id
    Body: file.data,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    return { Location: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.name}` };
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw new Error("Error uploading file");
  }
};

// Función para eliminar archivo de S3
const deleteFromS3 = async (fileUrl) => {
  const fileName = fileUrl.split('/').pop(); // Obtén el nombre del archivo desde la URL

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
    console.log(`File deleted successfully: ${fileName}`);
  } catch (error) {
    console.error("Error deleting file: ", error);
    throw new Error("Error deleting file");
  }
};

// Función para obtener una URL presignada
const getPresignedUrl = async (fileUrl) => {
  const fileName = fileUrl.split('/').pop(); // Obtén el nombre del archivo desde la URL

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  };

  try {
    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 9600 }); // URL expira en 1 hora
    return signedUrl;
  } catch (error) {
    console.error("Error generating presigned URL: ", error);
    throw new Error("Error generating presigned URL");
  }
};

module.exports = { uploadToS3, deleteFromS3, getPresignedUrl };
