const danhSach = document.querySelector("#Danh-sach");
const addCourseBtn = document.querySelector("#addCourseBtn");
const nameInput = document.querySelector("#name");
const descriptionInput = document.querySelector("#description");

const API_URL = "http://localhost:3000/courses";

// Lấy dữ liệu từ API và render lên
const getData = async () => {
   try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu');
      const data = await response.json();
      renderList(data);
   } catch (error) {
      console.error("Lỗi:", error);
   }
};

// Hàm render danh sách khóa học lên giao diện
const renderList = (data) => {
   danhSach.innerHTML = data.map(item => {
      return `
         <li>
            <h4>${item.name}</h4>
            <h4>${item.description}</h4>
         </li>
      `;
   }).join('');
};

const addCourse = async () => {
   // Lấy giá trị từ các trường nhập (input fields)
   const newCourse = {
      name: nameInput.value, // Lấy giá trị từ trường nhập 'name'
      description: descriptionInput.value // Lấy giá trị từ trường nhập 'description'
   };

   try {
      // Gửi yêu cầu POST tới API để thêm khóa học mới
      const response = await fetch(API_URL, {
         method: 'POST', // Phương thức HTTP là POST (dùng để thêm dữ liệu mới)
         headers: {
            'Content-Type': 'application/json', // Chỉ định loại nội dung là JSON (API sẽ hiểu chúng ta gửi dữ liệu dưới dạng JSON)
         },
         body: JSON.stringify(newCourse) // Chuyển đối tượng newCourse thành chuỗi JSON để gửi đi
      });

      // Kiểm tra xem yêu cầu có thành công không (status code 200-299)
      if (!response.ok) {
         throw new Error('Không thể thêm khóa học'); // Nếu không thành công, ném ra lỗi
      }

      // Nhận lại dữ liệu từ phản hồi của API (dữ liệu khóa học đã được thêm)
      const data = await response.json(); // Chuyển đổi dữ liệu phản hồi từ JSON thành đối tượng JavaScript
      console.log('Khóa học đã được thêm:', data); // In ra dữ liệu mới thêm vào để kiểm tra

      // Sau khi thêm thành công, tải lại danh sách khóa học từ API
      getData(); // Gọi hàm getData() để lấy lại danh sách khóa học cập nhật từ API

      // Xóa dữ liệu trong các trường nhập để chuẩn bị cho lần nhập tiếp theo
      nameInput.value = ''; // Xóa trường 'name'
      descriptionInput.value = ''; // Xóa trường 'description'
   } catch (error) {
      // Nếu có lỗi trong quá trình gửi yêu cầu hoặc xử lý phản hồi, hiển thị lỗi
      console.error("Lỗi khi thêm khóa học:", error); // In lỗi ra console
   }
};


// Thêm sự kiện khi người dùng nhấn nút "Add Course"
addCourseBtn.addEventListener("click", addCourse);

// Gọi hàm getData để tải danh sách khóa học ban đầu
getData();
