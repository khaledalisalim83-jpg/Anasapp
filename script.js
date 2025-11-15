// إعداد Firebase
const firebaseConfig = {
  apiKey: "ضع المفتاح هنا",
  authDomain: "ضع هنا رابط مشروعك.firebaseapp.com",
  projectId: "ضع هنا اسم المشروع",
  storageBucket: "ضع هنا رابط التخزين",
  messagingSenderId: "ضع هنا الرقم",
  appId: "ضع هنا appId"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// إنشاء حساب
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("status").innerText = "✅ تم إنشاء الحساب بنجاح";
    })
    .catch(error => {
      document.getElementById("status").innerText = "❌ " + error.message;
    });
}

// تسجيل دخول
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("status").innerText = "✅ تم تسجيل الدخول بنجاح";
    })
    .catch(error => {
      document.getElementById("status").innerText = "❌ " + error.message;
    });
}

// تسجيل خروج
function logout() {
  auth.signOut()
    .then(() => {
      document.getElementById("status").innerText = "🚪 تم تسجيل الخروج";
    })
    .catch(error => {
      document.getElementById("status").innerText = "❌ " + error.message;
    });
}// الوصول إلى قاعدة البيانات في Firestore
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from "firebase/firestore";

const db = getFirestore(app);

// عناصر واجهة الدردشة
const chatSection = document.getElementById("chatSection");
const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// عند تغيير حالة المستخدم
auth.onAuthStateChanged(user => {
  if (user) {
    setStatus("✅ مسجل دخول: " + (user.email || user.uid));
    chatSection.style.display = "block"; // إظهار الدردشة
    loadMessages(); // تحميل الرسائل
  } else {
    setStatus("❌ غير مسجل دخول حالياً");
    chatSection.style.display = "none"; // إخفاء الدردشة
  }
});

// إرسال رسالة
sendBtn.addEventListener("click", async () => {
  const text = messageInput.value.trim();
  const user = auth.currentUser;

  if (text && user) {
    await addDoc(collection(db, "messages"), {
      text: text,
      user: user.email,
      time: serverTimestamp()
    });
    messageInput.value = "";
  }
});

// تحميل الرسائل الحية
function loadMessages() {
  const q = query(collection(db, "messages"), orderBy("time", "asc"));
  onSnapshot(q, snapshot => {
    messagesDiv.innerHTML = "";
    snapshot.forEach(doc => {
      const msg = doc.data();
      const p = document.createElement("p");
      p.textContent = `${msg.user}: ${msg.text}`;
      messagesDiv.appendChild(p);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}