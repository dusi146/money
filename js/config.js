// js/config.js - ĐÃ ĐIỀN CHÌA KHÓA

const firebaseConfig = {
  apiKey: "AIzaSyAeYe30u0Tlh0xFFX8fnoGxH7k2_WTqxnU",
  authDomain: "money-572e2.firebaseapp.com",
  // Cái dòng này quan trọng nhất để lưu tiền nè:
  databaseURL: "https://money-572e2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "money-572e2",
  storageBucket: "money-572e2.firebasestorage.app",
  messagingSenderId: "215638079660",
  appId: "1:215638079660:web:aadea117cde75a5582c709",
  measurementId: "G-KMLYW8CT83"
};

// Khởi động Firebase
// (Không dùng import, mà dùng biến toàn cục từ file index.html)
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase đã kết nối thành công!");
} else {
    console.error("Lỗi: Chưa tải được thư viện Firebase từ index.html");
}
