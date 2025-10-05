"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FarewellPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({ name: "", text: "", image: "" });

  // 初期メッセージ読み込み
  useEffect(() => {
    const saved = localStorage.getItem("farewellMessages");
    if (saved) setMessages(JSON.parse(saved));
    else
      setMessages([
        { name: "佐藤", text: "一緒に働けて本当に楽しかったです！", image: "" },
        { name: "鈴木", text: "飲み会の幹事おつかれ！また集まろう！", image: "" },
      ]);
  }, []);

  // messages保存
  useEffect(() => {
    localStorage.setItem("farewellMessages", JSON.stringify(messages));
  }, [messages]);

  // 画像を安全にリサイズして読み込む関数
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1024; // 最大幅・高さ
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = Math.min(maxDim / width, maxDim / height);
          width = width * scale;
          height = height * scale;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.8); // 画質80%
        setNewMessage({ ...newMessage, image: resizedDataUrl });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const addMessage = (e) => {
    e.preventDefault();
    if (!newMessage.name || !newMessage.text) return;
    setMessages([...messages, newMessage]);
    setNewMessage({ name: "", text: "", image: "" });
  };

  const deleteMessage = (index) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  // IntersectionObserverでフェードイン
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [messages]);

  return (
    <div className="relative min-h-screen flex flex-col items-center text-center text-gray-800 overflow-hidden bg-gradient-to-b from-blue-200 via-blue-100 to-blue-200">
      {/* 雪 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-70 animate-fall"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* 背景光 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[120%] h-[120%] bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_70%)] animate-pulse-slow"></div>
        <div className="absolute w-[120%] h-[120%] bg-[radial-gradient(circle_at_70%_60%,rgba(173,216,230,0.2),transparent_70%)] animate-pulse-slower"></div>
      </div>

      {/* 集合写真 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="mt-20 z-10"
      >
        <img
          src="/douki.jpg"
          alt="同期の集合写真"
          className="rounded-2xl shadow-2xl w-4/5 max-w-2xl mx-auto border-4 border-blue-300"
        />
      </motion.div>

      {/* メインメッセージ */}
      <div className="mt-10 text-2xl font-semibold text-blue-900 drop-shadow-md z-10">
        これからもがんばって！❄️
      </div>

      {/* メッセージリスト */}
      <div className="mt-20 w-full max-w-2xl px-6 z-10">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="fade-in opacity-0 transform translate-y-8 mb-8 bg-white/20 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-blue-300 relative"
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="添付画像"
                  className="w-full max-h-48 object-cover rounded-lg mb-3"
                />
              )}
              <p className="text-lg text-blue-800 mb-3 leading-relaxed">{msg.text}</p>
              <p className="text-right text-sm text-blue-600">- {msg.name}</p>
              <button
                onClick={() => deleteMessage(i)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              >
                削除
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* メッセージ追加フォーム */}
      <div className="mt-12 mb-20 w-full max-w-md bg-white/20 p-6 rounded-2xl shadow-lg backdrop-blur-md border border-blue-300 z-10">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">メッセージを追加する 💬</h2>
        <form onSubmit={addMessage} className="space-y-3">
          <input
            type="text"
            placeholder="名前"
            value={newMessage.name}
            onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
            className="w-full p-2 rounded-lg bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none"
          />
          <textarea
            placeholder="メッセージ"
            value={newMessage.text}
            onChange={(e) => setNewMessage({ ...newMessage, text: e.target.value })}
            className="w-full p-2 rounded-lg bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none h-24"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full p-2 rounded-lg bg-white/70 text-gray-700 placeholder-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-300 hover:bg-blue-400 text-blue-900 font-semibold py-2 rounded-lg transition-colors"
          >
            追加する
          </button>
        </form>
      </div>

      <footer className="text-blue-900 text-sm mb-10 z-10">
        <p>With love from your colleagues ❄️</p>
      </footer>

      <style>{`
        .fade-in.show {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }
        @keyframes fall {
          0% { transform: translateY(-10px); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        .animate-fall { animation: fall linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 12s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
