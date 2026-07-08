import { getStudentList } from "../../services/profile.service.js";

export const useGetStudentList = (studentList, setStudentList) => {
    const fetchStudentList = async () => {
        try {
            const data = await getStudentList();
            setStudentList(data);
        } catch (error) {
            console.error("Error al obtener lista de estudiantes:", error);
            setStudentList([]);
        }
    };

    return [studentList, fetchStudentList];
};