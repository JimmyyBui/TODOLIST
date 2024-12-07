const listCourse = document.querySelector("#Danh-sach");
const btnAddCourse = document.querySelector("#addCourseBtn");
const nameInput = document.querySelector("#name");
const descriptionInput = document.querySelector("#description");

const API_URL = "http://localhost:3000/courses";

// Hàm lấy dữ liệu và hiển thị danh sách khóa học
const getData = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Không thể tải danh sách khóa học");
        }
        const data = await response.json();
        console.log(data);

        if (data) {
            listCourse.innerHTML = data.map(item => {
                return `
                    <li>
                        <h4>${item.name}</h4>
                        <h4>${item.description}</h4>
                        <button onclick="deleteCourse('${item.id}')">Xóa</button>
                        <button onclick="editCourse('${item.id}')">Sửa</button>
                    </li> 
                `;
            }).join('');
        }
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
};
getData();

// Hàm thêm khóa học
const addCourse = async () => {
    const newCourse = {
        name: nameInput.value,
        description: descriptionInput.value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newCourse)
        });

        if (!response.ok) {
            throw new Error("Không thể thêm khóa học");
        }

        const data = await response.json();
        console.log("Khóa học đã được thêm vào:", data);

        // Sau khi thêm thành công, tải lại danh sách khóa học từ API
        getData();

        // Xóa dữ liệu trong các trường nhập để chuẩn bị cho lần nhập tiếp theo
        nameInput.value = "";
        descriptionInput.value = "";
    } catch (error) {
        console.error("Lỗi khi thêm khóa học:", error);
    }
};

// Thêm sự kiện khi người dùng click
btnAddCourse.addEventListener("click", addCourse);

// Hàm xoá khóa học
const deleteCourse = async (id) => {
    try {
        console.log("ID khóa học cần xóa:", id);  // In ra ID để kiểm tra
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Không thể xóa khóa học với ID ${id}`);
        }

        const data = await response.json();
        console.log("Khóa học đã được xóa:", data);

        // Sau khi xóa thành công, tải lại danh sách khóa học từ API
        getData();
    } catch (error) {
        console.error("Lỗi khi xóa khóa học:", error);
    }
};

// Hàm sửa khóa học
let currentCourseId = null; // Biến lưu ID của khóa học hiện tại khi sửa

const editCourse = async (id) => {
    currentCourseId = id; // Ghi nhớ ID khóa học đang sửa
    try {
        // Lấy dữ liệu khóa học từ API
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error("Không thể lấy dữ liệu khóa học để sửa");
        }
        const course = await response.json();
        console.log("Dữ liệu khóa học cần sửa:", course);

        // Hiển thị dữ liệu hiện tại vào các trường nhập liệu
        nameInput.value = course.name;
        descriptionInput.value = course.description;

        // Đổi nút từ "Thêm" thành "Lưu sửa"
        btnAddCourse.textContent = "Lưu sửa";
        btnAddCourse.removeEventListener("click", addCourse); // Xoá sự kiện "Thêm" cũ

        // Đặt sự kiện mới cho nút "Lưu sửa"
        btnAddCourse.addEventListener("click", saveCourse);
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khóa học:", error);
    }
};

// Hàm lưu sửa khóa học
const saveCourse = async () => {
    const updatedCourse = {
        name: nameInput.value,
        description: descriptionInput.value
    };

    try {
        const response = await fetch(`${API_URL}/${currentCourseId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedCourse)
        });

        if (!response.ok) {
            throw new Error("Không thể cập nhật khóa học");
        }

        const updatedData = await response.json();
        console.log("Khóa học đã được cập nhật:", updatedData);

        // Sau khi sửa thành công, tải lại danh sách khóa học từ API
        getData();

        // Đặt lại form và nút về trạng thái ban đầu
        nameInput.value = "";
        descriptionInput.value = "";
        btnAddCourse.textContent = "Thêm khóa học"; // Đổi lại nút về trạng thái "Thêm"
        btnAddCourse.removeEventListener("click", saveCourse); // Xoá sự kiện "Lưu sửa"
        btnAddCourse.addEventListener("click", addCourse); // Đặt lại sự kiện về chức năng thêm khóa học
    } catch (error) {
        console.error("Lỗi khi sửa khóa học:", error);
    }
};
