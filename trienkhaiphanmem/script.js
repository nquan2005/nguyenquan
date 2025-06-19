// script.js

// Xử lý đăng nhập
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn chặn form submit mặc định

    // Lấy giá trị từ trường email
    const email = document.getElementById('email').value.trim().toLowerCase();

    // Xác định quyền dựa trên email
    let role = 'guest'; // Mặc định là guest

    if (email === 'admin@gmail.com') {
        role = 'admin';
    } else if (email === 'patient@gmail.com') {
        role = 'patient';
    }

    // Lưu thông tin người dùng vào localStorage
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);

    // Chuyển hướng đến trang chủ
    window.location.href = 'index.html';
});

// Hàm để hiển thị menu dựa trên quyền người dùng
function renderMenu() {
    const navMenu = document.querySelector('.nav-menu ul');
    navMenu.innerHTML = ''; // Xóa menu hiện tại

    // Lấy quyền người dùng từ localStorage
    const role = localStorage.getItem('userRole') || 'guest';

    // Định nghĩa các menu theo quyền
    const menus = {
        admin: [
            { name: 'Trang chủ', link: 'index.html' },
            { name: 'Giới thiệu', link: '#' },
            { name: 'Xem (Danh Sách lịch khám)', link: '#' },
            { name: 'Nhập', link: 'nhap.html' },
            { name: 'Đăng nhập', link: 'login.html' }
        ],
        patient: [
            { name: 'Trang chủ', link: 'index.html' },
            { name: 'Giới thiệu', link: '#' },
            { name: 'Đặt lịch', link: 'nhap.html' }, // Đặt lịch sử dụng trang nhập
            { name: 'Đăng nhập', link: 'login.html' }
        ],
        guest: [
            { name: 'Trang chủ', link: 'index.html' },
            { name: 'Giới thiệu', link: '#' },
            { name: 'Đăng nhập', link: 'login.html' }
        ]
    };

    // Lấy menu phù hợp với quyền
    const currentMenu = menus[role] || menus['guest'];

    // Tạo các mục menu
    currentMenu.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.link;
        a.textContent = item.name;
        li.appendChild(a);
        navMenu.appendChild(li);
    });

    // Nếu người dùng đã đăng nhập, thay đổi "Đăng nhập" thành "Đăng xuất"
    if (role !== 'guest') {
        const logoutLi = document.createElement('li');
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Đăng xuất';
        logoutBtn.id = 'logoutBtn';
        logoutBtn.style.background = 'none';
        logoutBtn.style.border = 'none';
        logoutBtn.style.color = 'white';
        logoutBtn.style.cursor = 'pointer';
        logoutBtn.style.padding = '15px';
        logoutBtn.style.width = '100%';
        logoutBtn.style.textAlign = 'left';
        logoutBtn.style.fontSize = '1em';

        logoutBtn.addEventListener('click', function() {
            // Xóa thông tin người dùng khỏi localStorage
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userRole');

            // Tải lại trang để cập nhật menu
            window.location.href = 'index.html';
        });

        logoutLi.appendChild(logoutBtn);
        navMenu.appendChild(logoutLi);
    }
}

// Gọi hàm renderMenu khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra xem đang ở trang nào để thực hiện hành động phù hợp
    const path = window.location.pathname;
    const page = path.split("/").pop();

    if (page === 'index.html' || page === '') {
        renderMenu();
    }

    if (page === 'nhap.html') {
        setupNhapForm();
    }

    if (page === 'thanhcong.html') {
        displaySuccess();
    }

    if (page === 'login.html') {
        // Có thể hiển thị thông tin người dùng hoặc các chức năng khác
    }
});

// Hàm để thiết lập form Nhập
function setupNhapForm() {
    const chuyenkhoaSelect = document.getElementById('chuyenkhoa');
    const bacsiSelect = document.getElementById('bacsi');

    chuyenkhoaSelect.addEventListener('change', function() {
        const selectedChuyenkhoa = this.value;
        bacsiSelect.innerHTML = '<option value="">-- Chọn bác sĩ --</option>'; // Reset bác sĩ
        if (selectedChuyenkhoa === 'Nội') {
            bacsiSelect.innerHTML += `
                <option value="BS.Nguyễn Văn Dũng">BS.Nguyễn Văn Dũng</option>
                <option value="BS.Trần Minh Quân">BS.Trần Minh Quân</option>
            `;
        } else if (selectedChuyenkhoa === 'Ngoại') {
            bacsiSelect.innerHTML += `
                <option value="BS.Lê Thị Hồng">BS.Lê Thị Hồng</option>
                <option value="BS.Phạm Đức Thịnh">BS.Phạm Đức Thịnh</option>
            `;
        }

        if (selectedChuyenkhoa !== '') {
            bacsiSelect.disabled = false;
        } else {
            bacsiSelect.disabled = true;
        }
    });

    // Validation và submit form
    document.getElementById('nhapForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn chặn form submit mặc định

        // Lấy giá trị từ các trường
        const hoten = document.getElementById('hoten').value.trim();
        const sdt = document.getElementById('sdt').value.trim();
        const chuyenkhoa = document.getElementById('chuyenkhoa').value;
        const bacsi = document.getElementById('bacsi').value;

        // Xác thực dữ liệu
        let errorMessages = [];

        if (hoten === '') {
            errorMessages.push('Vui lòng nhập họ tên bệnh nhân.');
        }

        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(sdt)) {
            errorMessages.push('Số điện thoại phải gồm 10 chữ số.');
        }

        if (chuyenkhoa === '') {
            errorMessages.push('Vui lòng chọn chuyên khoa.');
        }

        if (bacsi === '') {
            errorMessages.push('Vui lòng chọn bác sĩ.');
        }

        if (errorMessages.length > 0) {
            displayError(errorMessages.join(' '));
            return;
        }

        // Lưu dữ liệu vào localStorage (tích lũy thông tin)
        let danhSachBenhNhan = JSON.parse(localStorage.getItem('danhSachBenhNhan')) || [];
        danhSachBenhNhan.push({ hoten, sdt, chuyenkhoa, bacsi });
        localStorage.setItem('danhSachBenhNhan', JSON.stringify(danhSachBenhNhan));

        // Chuyển hướng với dữ liệu qua URL
        const queryParams = new URLSearchParams({ hoten, chuyenkhoa, bacsi });
        window.location.href = `thanhcong.html?${queryParams.toString()}`;
    });
}

// Hàm để hiển thị thông tin thành công
function displaySuccess() {
    const params = new URLSearchParams(window.location.search);
    const hoten = params.get('hoten') || '';
    const chuyenkhoa = params.get('chuyenkhoa') || '';
    const bacsi = params.get('bacsi') || '';

    document.getElementById('displayHoten').textContent = hoten;
    document.getElementById('displayChuyenkhoa').textContent = chuyenkhoa;
    document.getElementById('displayBacsi').textContent = bacsi;

    // Xử lý nút OK
    document.getElementById('okBtn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
}

// Hàm để hiển thị lỗi
function displayError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
}
