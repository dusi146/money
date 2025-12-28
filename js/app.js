// js/app.js - BẢN ĐỒNG BỘ ONLINE (REALTIME)

const coinSound = new Audio('js/tien.mp3'); 

const App = {
    data: [], 
    myName: null,

    init: function() {
        console.log("App starting online mode...");
        this.bindEvents();
        // Không loadData() thủ công nữa, mà lắng nghe realtime
        this.listenRealtime();
    },

    // --- HÀM MỚI: LẮNG NGHE DỮ LIỆU TỪ MÂY ---
    listenRealtime: function() {
        const dbRef = firebase.database().ref('transactions');
        
        // Bất cứ khi nào dữ liệu trên mây thay đổi, hàm này sẽ chạy
        dbRef.on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Firebase trả về object, ta đổi sang mảng để dễ xử lý
                this.data = Object.values(data);
                
                // Sắp xếp lại: Cái mới nhất (thời gian lớn nhất) lên đầu
                this.data.sort((a, b) => b.d - a.d);
            } else {
                this.data = [];
            }
            
            // Vẽ lại giao diện ngay lập tức
            if (this.myName) { // Chỉ vẽ nếu đã đăng nhập
                this.render();
            }
        });
    },

    // --- HÀM MỚI: ĐẨY DỮ LIỆU LÊN MÂY ---
    pushToCloud: function(item) {
        // Đẩy 1 item mới lên (dùng push để tạo ID ngẫu nhiên không trùng)
        firebase.database().ref('transactions').push(item, (error) => {
            if (error) {
                alert("Lỗi mạng! Không lưu được: " + error);
            } else {
                console.log("Đã lưu lên mây thành công!");
            }
        });
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

            // Gọi render ngay để hiện dữ liệu (nếu đã load xong từ trước)
            this.render();
            errorMsg.innerText = "";
        } else {
            errorMsg.innerText = "Sai mật khẩu rồi cưng ơi!";
            loginBox.classList.add('shake');
            setTimeout(() => loginBox.classList.remove('shake'), 500);
        }
    },

    render: function() {
        let total = 0, myTotal = 0;
        const user1 = Auth.users[0].username;
        const user2 = Auth.users[1].username;
        let totalUser1 = 0;
        let totalUser2 = 0;

        this.data.forEach(item => {
            total += item.a;
            if(item.u === user1) totalUser1 += item.a;
            if(item.u === user2) totalUser2 += item.a;
            if(item.u === this.myName) myTotal += item.a;
        });

        UI.renderHistory(this.data, this.myName);
        UI.updateStats(total, myTotal);

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
            // Tạo object item mới
            const newItem = { 
                u: this.myName, 
                a: amount, 
                n: noteIn.value, 
                d: Date.now() 
            };

            // Gửi lên mây (Không cần this.data.unshift thủ công nữa, Firebase sẽ báo về sau)
            this.pushToCloud(newItem);

            this.playSound();
            UI.makeItRain();
            
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

    settle: function() {
        const totals = this.render();
        const u1 = totals.user1Name;
        const u2 = totals.user2Name;
        const t1 = totals[u1]; 
        const t2 = totals[u2];

        const diff = t1 - t2; 
        const pay = Math.abs(diff) / 2;
        const resEl = document.getElementById('settle-result');

        if (diff === 0) {
            resEl.innerHTML = "HÒA TIỀN! CẢ NHÀ CÙNG VUI.";
        } else {
            const payer = diff > 0 ? u2 : u1;
            const receiver = diff > 0 ? u1 : u2;
            
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
