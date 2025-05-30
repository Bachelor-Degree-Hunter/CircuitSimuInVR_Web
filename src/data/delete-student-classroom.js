import axios from 'axios';
import Swal from 'sweetalert2';
export const deleteStudentAPI = async (uid, class_id) => {
    try {
        const response = await axios.delete(`https://smith11.ce.kmitl.ac.th/api/classroom/student/${uid}/${class_id}`);
        // console.log(response.data.message);
        if(response.status === 200){
            Swal.fire({
                title: "Deleted!",
                text: `${uid} has been deleted.`,
                icon: "success", confirmButtonText: "OK",
                customClass: {
                    confirmButton: 'bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600',
                }
            });
        }
    } catch (error) {
        console.error("Error deleting student of classroom:", error);
        Swal.fire({
            title: "Failed!",
            text: `Can not delete ${uid} .`,
            icon: "success", confirmButtonText: "OK",
            customClass: {
                confirmButton: 'bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600',
            }
        });
    }
};