const Auth = {
    // Danh sách user được phép vào (Database chạy bằng cơm)
    users: [
        { username: 'pdt146', password: 'pdt2006@', name: 'duvansi' },
        { username: 'nhp2006', password: 'nhp2006@', name: 'MessPhuc' }
    ],

    currentUser: null,

    // Hàm kiểm tra đăng nhập
    login: function(user, pass) {
        // Tìm xem có user nào khớp cả tên lẫn pass không
        const foundUser = this.users.find(u => u.username === user && u.password === pass);
        
        if (foundUser) {
            this.currentUser = foundUser;
            return true; // Đăng nhập thành công
        }
        return false; // Sai bét
    },

    getUser: function() {
        return this.currentUser;
    }
};