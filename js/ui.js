const UI = {
    // Data tin nhắn bựa
    msgs: {
        small: [
            "Tiền lẻ mà cũng khoe à?", "Mua tăm xỉa răng hay gì?", "Nhập làm gì cho tốn data?", 
            "Nghèo thì bớt ăn hàng lại.", "Chắc rớt mùng tơi quá.", "Số tiền này không đủ mua hành.",
            "Cẩn thận nhập sai nha đại gia.", "Đừng nói là mua kẹo mút nha.", "Thôi cất đi, ngại quá."
        ],
        medium: [
            "Cũng ra dáng con người rồi đấy.", "Hôm nay trúng lô à?", "Tiêu pha ác chiến thế.", 
            "Bớt bớt lại, cuối tháng húp cháo.", "Tiền đi nhanh như người yêu cũ.", "Mạnh dạn thế nhờ.",
            "Cũng gọi là có tí điều kiện.", "Cơm áo gạo tiền mệt mỏi ha.", "Ví bắt đầu mỏng đi rồi đấy."
        ],
        large: [
            "ĐẠI GIA CHÂN ĐẤT!", "Vãi chưởng, giàu thế bạn tôi.", "Bán thận chưa mà tiêu ghê thế?", 
            "Tiền là lá mít à?", "Nuôi ai mà tốn thế?", "Chắc mới trúng Vietlott.", 
            "Tiêu thế này thì tiền núi cũng lở.", "Đúng là người thành đạt có lối đi riêng.", "Xin hãy bao nuôi tôi!"
        ]
    },

    // Hàm đổi theme
    setTheme: function(theme) {
        document.body.setAttribute('data-theme', theme);
        document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
        
        // Tìm nút tương ứng để active
        const btnMap = { 'neon': 0, 'light': 1, 'dark': 2 };
        document.querySelectorAll('.theme-btn')[btnMap[theme]].classList.add('active');
    },

    // Hiệu ứng tiền rơi
    makeItRain: function() {
        const symbols = ['💸', '💰', '💵', '🤑', '💎'];
        for(let i=0; i<30; i++) {
            const el = document.createElement('div');
            el.classList.add('money-rain');
            el.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            el.style.left = Math.random() * 100 + 'vw';
            el.style.animationDuration = (Math.random() * 2 + 1) + 's';
            el.style.opacity = Math.random();
            el.style.fontSize = (Math.random() * 20 + 20) + 'px';
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 3000);
        }
    },

    // Logic hiển thị câu troll khi nhập tiền
    checkAmount: function(val) {
        const msgEl = document.getElementById('troll-msg');
        let pool = [];
        
        if (val === 0) pool = ["Nhập tiền đi bạn êi..."];
        else if (val < 50000) pool = this.msgs.small;
        else if (val < 500000) pool = this.msgs.medium;
        else pool = this.msgs.large;

        if(val > 0) msgEl.innerText = pool[Math.floor(Math.random() * pool.length)];
        else msgEl.innerText = "Nhập tiền đi bạn êi...";
    },

    // Render danh sách lịch sử
    renderHistory: function(data, myName) {
        const list = document.getElementById('history-list');
        list.innerHTML = '';
        
        data.forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                <div>
                    <strong style="color: ${item.u === 'A' ? 'var(--primary)' : 'var(--accent)'}">${item.u}</strong>: ${item.n}
                    <br><small style="opacity:0.6; font-size:11px">Vừa xong</small>
                </div>
                <div style="font-weight:800; color:var(--text-main)">${item.a.toLocaleString()} đ</div>
            `;
            list.appendChild(li);
        });
    },

    // Update 2 cái card thống kê
    updateStats: function(total, myTotal) {
        document.getElementById('total-spent').innerText = total.toLocaleString() + ' đ';
        document.getElementById('my-spent').innerText = myTotal.toLocaleString() + ' đ';
    },

    // Xử lý Modal
    showModal: function() {
        const modal = document.getElementById('modal-overlay');
        modal.classList.add('active');
        // Animation modal dùng GSAP
        if(typeof gsap !== 'undefined') {
            gsap.from(".modal-content", { scale: 0.5, opacity: 0, duration: 0.4, ease: "back.out(1.7)" });
        }
    },

    closeModal: function() {
        document.getElementById('modal-overlay').classList.remove('active');
    }
};