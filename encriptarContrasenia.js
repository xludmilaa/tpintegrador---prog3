import bcrypt from 'bcryptjs';

async function encriptarContrasenia(contrasenia) {
  const hashedPassword = await bcrypt.hash(contrasenia, 10);
  console.log('Contraseña original:', contrasenia);
  console.log('Contraseña hasheada:', hashedPassword);
  return hashedPassword;
}

const nuevaContrasenia = 'cont';

encriptarContrasenia(nuevaContrasenia)
  .then(hashedPassword => {
    console.log('Este es el hash que deberías almacenar en la base de datos:', hashedPassword);
    console.log('Y esta es la contraseña que el usuario debe usar para iniciar sesión:', nuevaContrasenia);
  })
  .catch(error => console.error('Error al encriptar la contraseña:', error));
