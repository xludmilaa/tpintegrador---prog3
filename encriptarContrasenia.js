import bcrypt from 'bcryptjs';

//---Función para encriptar la contraseña

async function encriptarContrasenia(contrasenia) {
  const hashedPassword = await bcrypt.hash(contrasenia, 10);
  console.log('Contraseña original:', contrasenia);
  console.log('Contraseña hasheada:', hashedPassword);
  return hashedPassword;
}

//---Usa una nueva contraseña en texto plano

const nuevaContrasenia = 'daetar';

//---Llama a la función con la nueva contraseña

encriptarContrasenia(nuevaContrasenia)
  .then(hashedPassword => {
    console.log('Este es el hash que deberías almacenar en la base de datos:', hashedPassword);
    console.log('Y esta es la contraseña que el usuario debe usar para iniciar sesión:', nuevaContrasenia);
  })
  .catch(error => console.error('Error al encriptar la contraseña:', error));