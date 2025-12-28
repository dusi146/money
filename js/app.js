// js/app.js - BẢN FIX TỰ ĐỘNG NHẬN DIỆN TÊN USER

const coinSound = new Audio('js/tien.mp3'); 

const App = {
    data: [], 
    myName: null,

    init: function() {
        console.log("App starting...");
        this.loadData();
        this.bindEvents();
    },

    loadData: function() {
        const storedData = localStorage.getItem('quyden_vip_data');
        if (storedData) {
            this.data = JSON.parse(storedData);
        } else {
            this.data = [];
        }
    },

    saveData: function() {
        localStorage.setItem('quyden_vip_data', JSON.stringify(this.data));
    },

    handleLogin: function() {
        const userInp = document.getElementById('login-user').value.trim();
        const passInp = document.getElementById('login-pass').value.trim();
        const errorMsg = document.getElementById('login-error');
        const loginBox = document.querySelector('#login-screen .glass');

        if(Auth.login(userInp, passInp)) {
            const user = Auth.getUser();
            this.myName = user.username;
            
            document.getElementById('login-screen').classList.add('hidden');
            const appEl = document.getElementById('app');
            appEl.classList.remove('hidden');
            
            if(typeof gsap !== 'undefined') {
                gsap.from(appEl, { opacity: 0, scale: 0.9, duration: 0.5 });
            }

            this.render();
            errorMsg.innerText = "";
        } else {
            errorMsg.innerText = "Sai mật khẩu rồi cưng ơi!";
            loginBox.classList.add('shake');
            setTimeout(() => loginBox.classList.remove('shake'), 500);
        }
    },

    // --- HÀM TÍNH TOÁN ĐƯỢC SỬA LẠI ĐỂ KHÔNG PHỤ THUỘC VÀO TÊN A HAY B ---
    render: function() {
        let total = 0, myTotal = 0;
        
        // Lấy tên 2 user từ file config Auth ra (Thái, Phúc...)
        const user1 = Auth.users[0].username;
        const user2 = Auth.users[1].username;

        let totalUser1 = 0;
        let totalUser2 = 0;

        this.data.forEach(item => {
            total += item.a;
            
            // So sánh động: Nếu item này của user1 thì cộng cho user1, user2 thì cộng user2
            if(item.u === user1) totalUser1 += item.a;
            if(item.u === user2) totalUser2 += item.a;
            
            if(item.u === this.myName) myTotal += item.a;
        });

        UI.renderHistory(this.data, this.myName);
        UI.updateStats(total, myTotal);

        // Trả về object chứa tên và số tiền cụ thể
        return { 
            [user1]: totalUser1, 
            [user2]: totalUser2,
            user1Name: user1,
            user2Name: user2
        };
    },

    addTransaction: function() {
        const amtIn = document.getElementById('amount');
        const noteIn = document.getElementById('note');
        const amount = parseInt(amtIn.value);

        if (amount && noteIn.value) {
            this.data.unshift({ u: this.myName, a: amount, n: noteIn.value, d: Date.now() });
            this.saveData();
            this.playSound();
            UI.makeItRain();
            this.render();
            
            amtIn.value = '';
            noteIn.value = '';
            document.getElementById('troll-msg').innerText = "Đã bơm tiền thành công!";
            
            if(typeof gsap !== 'undefined') {
                gsap.from("#add-btn", { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
            }
        } else {
            alert("Nhập đủ tiền và nội dung đi cha nội!");
        }
    },

    // --- HÀM CHỐT SỔ CŨNG ĐƯỢC SỬA LẠI ---
    settle: function() {
        const totals = this.render();
        
        // Lấy tên 2 ông
        const u1 = totals.user1Name; // Ví dụ: Thái
        const u2 = totals.user2Name; // Ví dụ: Phúc
        
        // Lấy tổng tiền 2 ông
        const t1 = totals[u1]; 
        const t2 = totals[u2];

        // Tính chênh lệch: (Tiền ông 1 - Tiền ông 2)
        const diff = t1 - t2; 
        const pay = Math.abs(diff) / 2;
        const resEl = document.getElementById('settle-result');

        if (diff === 0) {
            resEl.innerHTML = "HÒA TIỀN! CẢ NHÀ CÙNG VUI.";
        } else {
            // Nếu diff > 0 (Ông 1 chi nhiều hơn) -> Ông 2 phải trả (Payer = u2)
            // Nếu diff < 0 (Ông 2 chi nhiều hơn) -> Ông 1 phải trả (Payer = u1)
            const payer = diff > 0 ? u2 : u1;
            const receiver = diff > 0 ? u1 : u2;
            
            // Logic chọn ảnh QR: Nếu người nhận là user đầu tiên trong danh sách (Index 0) thì lấy qr_a
            // Ngược lại lấy qr_b
            // Lưu ý: User 1 (Thái) sẽ ứng với qr_a.jpg, User 2 (Phúc) ứng với qr_b.jpg
            const isReceiverUser1 = (receiver === Auth.users[0].username);
            const qrImage = isReceiverUser1 ? 'images/qr_a.jpg' : 'images/qr_b.jpg';

            const color = diff > 0 ? '#ec4899' : '#3b82f6';
            
            resEl.innerHTML = `
                <div style="font-size:40px; margin-bottom:10px">💸</div>
                <strong>${payer}</strong> PHẢI BÙ CHO <strong>${receiver}</strong>
                <div style="font-size: 32px; font-weight: 900; color: ${color}; margin: 15px 0;">
                    ${pay.toLocaleString()} đ
                </div>
                
                <div style="margin: 10px auto; width: 200px; height: 200px; background: white; padding: 10px; border-radius: 10px;">
                    <img src="${qrImage}" style="width: 100%; height: 100%; object-fit: contain;" alt="QR Code">
                </div>
                <small style="display:block; margin-top:5px">Quét mã trả luôn cho nóng!</small>
            `;
        }
        
        UI.showModal();
    },

    playSound: function() {
        coinSound.currentTime = 0;
        coinSound.play().catch(() => console.log('Chưa tương tác user nên chưa play audio được'));
    },

    bindEvents: function() {
        document.getElementById('amount').addEventListener('input', (e) => {
            UI.checkAmount(parseInt(e.target.value) || 0);
        });

        document.getElementById('add-btn').addEventListener('click', () => {
            this.addTransaction();
        });

        document.getElementById('settle-btn').addEventListener('click', () => {
            this.settle();
        });

        const passInput = document.getElementById('login-pass');
        if(passInput) {
            passInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleLogin();
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});