export const MIN_FULLNAME = 3;
export const MAX_FULLNAME = 500;
export const FULLNAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/;

export const TEACHER_ROLE = 'profesor';
export const STUDENT_ROLE = 'estudiante';
export const ADMIN_ROLE = 'ADMINISTRADOR';
export const SECRETARIA_ROLE = 'SECREATRIA';
export const VALID_ROLES = [TEACHER_ROLE, 'estudiante', ADMIN_ROLE, SECRETARIA_ROLE];
export const VALID_ADMIN_ROLES = [SECRETARIA_ROLE, ADMIN_ROLE];
export const VALID_SUPERADMIN_ROLES = [ADMIN_ROLE];

export const VALID_EMAIL_DOMAINS = ['@ubiobio.cl', '@alumnos.ubiobio.cl','@gmail.com','@gmail.cl'];

export const MIN_DATE_LENGTH = 1;
export const MAX_DATE_LENGTH = 200;

export const UNKNOWN_ERROR = "Error desconocido";

export const MAX_ID = 100000000;
export const MIN_ID = 1;

// NUEVAS CONSTANTES
export const REGISTRO_ESTADOS = {
  EN_ESPERA: 'en_espera',
  VERIFICADO: 'verificado',
  RECHAZADO: 'rechazado'
};

export const ESTADO_PAGO = {
  PENDIENTE: 'pendiente',
  PAGADO: 'pagado',
  VENCIDO: 'vencido'
};

export const SEDES_VALIDAS = [
  'Sede Concepción',
  'Sede Chillán',
  'Sede Los Ángeles',
  'Sede Talcahuano'
];




/*

export const MIN_FULLNAME = 3;
export const MAX_FULLNAME = 500;
export const FULLNAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/;


export const TEACHER_ROLE = 'profesor';
export const STUDENT_ROLE = 'estudiante';
export const ADMIN_ROLE = 'ADMINISTRADOR';
export const SECRETARIA_ROLE = 'SECRETARIA';
export const VALID_ROLES = [TEACHER_ROLE, 'estudiante', ADMIN_ROLE,SECRETARIA_ROLE];
export const VALID_ADMIN_ROLES = [SECRETARIA_ROLE, ADMIN_ROLE];
export const VALID_SUPERADMIN_ROLES = [ADMIN_ROLE];

export const VALID_EMAIL_DOMAINS = ['@ubiobio.cl', '@alumnos.ubiobio.cl','@gmail.com','@gmail.cl'];

export const MIN_DATE_LENGTH = 1;
export const MAX_DATE_LENGTH = 200;

export const UNKNOWN_ERROR = "Error desconocido";

export const MAX_ID = 100000000;
export const MIN_ID = 1;

export const REGISTRO_ESTADOS = {
  EN_ESPERA: 'en_espera',
  ACEPTADO: 'aceptado',
  RECHAZADO: 'rechazado'
};

export const ESTADO_PAGO = {
  PENDIENTE: 'pendiente',
  PAGADO: 'pagado',
  VENCIDO: 'vencido'
};

export const SEDES_VALIDAS = [
  'Sede Concepción',
  'Sede Hualpen',
  'Sede Nonguen',
  'Sede San Pedro de la Paz',
];
*/
/*export const caseConverter = (string) => {
    if (!string || typeof(string) !== "string" || (string = string.trim()).length <= 1) {
        return "Error";
    }
    return (String(string).substring(0, 1).toUpperCase())  + (String(string).substring(1).toLowerCase());
}

export const fullnameRegexMessageGenerator = (pronoun, name) => {
    if (!name || typeof(name) !== "string" || (name = name.trim()).length <= 0) {
        name = "campo";
    }
    if (!pronoun || typeof(pronoun) !== "string" || (pronoun = pronoun.trim()).length <= 0) {
        pronoun = "el";
    }
    pronoun = caseConverter(pronoun);
    name = String(name).toLowerCase();
    return `${pronoun} ${name} solo puede tener letras y espacios`;
}*/