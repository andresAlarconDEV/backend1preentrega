export const generatorUserError = (data) => {
    return `Todos los campos son requeridos y deben ser validos 😱.
      Lista de campos recibidos en la solicitud:
      - first_name  : ${data.first_name}
      - last_name   : ${data.last_name}
      - email       : ${data.email}
      - age         : ${data.age}
      `;
  };
  
  export const generatorUserIdError = (id) => {
    return `Se debe enviar un identificador valido 😱.
      Valor recibido: ${id}
    `;
  };

  export const generatorLoginError = (email) => {
    return `El usuario o contraseña son incorrectos.
      Valor recibido: ${email}
    `;
  };