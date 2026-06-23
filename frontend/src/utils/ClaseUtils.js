export const getTeacherEmail = (teacher) => {
    const DEFAULT_EMAIL = "juanitoperez@autitos.cl";
    if (typeof(teacher) !== "string") {
        return DEFAULT_EMAIL
    }
    try {
        const splitTeacher = teacher.split("(")[1];
        const trimmedTeacher = splitTeacher.substring(0, splitTeacher.length - 1);
        console.log("TRIMMED TEACHER: ", trimmedTeacher);
        return trimmedTeacher;
    } catch (error) {
        console.error(error);
        return DEFAULT_EMAIL;
    }
}