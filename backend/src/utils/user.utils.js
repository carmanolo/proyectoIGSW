export const processTeachers = (teachers) => {
    const DEFAULT_TEACHERS = [];
    if (!Array.isArray(teachers)) {
        console.error("¡Los profesores deben ser un arreglo!");
        return DEFAULT_TEACHERS;
    }
    const processedTeachers = teachers.map((teacher) => {
        return (String(teacher.id || "0")) + ". " + (String(teacher.nombre) || "Juanito Perez") + " (" + (String(teacher.email) || "juanitoperez@escuela.cl") + ")"; 
    });
    return processedTeachers;
}

export const processStudents = (students) => {
    const DEFAULT_STUDENTS = [];
    if (!Array.isArray(students)) {
        console.error("¡Los ALUMNOS deben ser un arreglo!");
        return DEFAULT_STUDENTS;
    }
    const processedTeachers = students.map((student) => {
        return (String(student.id || "0")) + ". " + (String(student.nombre) || "niño simbolo") + " (" + (String(student.email) || "angelosalgado@escuela.cl") + ")"; 
    });
    return processedTeachers;
}