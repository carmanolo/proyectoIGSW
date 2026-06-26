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