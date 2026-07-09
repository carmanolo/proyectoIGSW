export const MIN_FULLNAME = 3;
export const MAX_FULLNAME = 500;
export const FULLNAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/;


export const TEACHER_ROLE = 'profesor';
export const STUDENT_ROLE = 'estudiante';
export const ADMIN_ROLE = 'ADMINISTRADOR';
export const SECRETARIA_ROLE = 'SECRETARIO';
export const VALID_ROLES = [TEACHER_ROLE, 'estudiante', ADMIN_ROLE,SECRETARIA_ROLE];
export const VALID_ADMIN_ROLES = [SECRETARIA_ROLE, ADMIN_ROLE];
export const VALID_SUPERADMIN_ROLES = [ADMIN_ROLE];

export const VALID_EMAIL_DOMAINS = ['@ubiobio.cl', '@alumnos.ubiobio.cl','@gmail.com','@gmail.cl'];

export const MIN_DATE_LENGTH = 1;
export const MAX_DATE_LENGTH = 200;

export const UNKNOWN_ERROR = "Error desconocido";

export const MAX_ID = 100000000;
export const MIN_ID = 1;

