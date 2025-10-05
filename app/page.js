'use client'

import { motion } from "framer-motion";
import { useEffect } from "react";

export default function FarewellPage() {
  useEffect(() => {
    // メッセージのフェードイン制御
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

    // 雪アニメーション生成
    const canvas = document.getElementById("snow");
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let snowflakes = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3 + 1,
      d: Math.random() + 1
    }));

    function drawSnow() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();
      snowflakes.forEach((f) => {
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      });
      ctx.fill();
      updateSnow();
    }

    let angle = 0;
    function updateSnow() {
      angle += 0.01;
      snowflakes.forEach((f) => {
        f.y += Math.pow(f.d, 2) + 1;
        f.x += Math.sin(angle) * 0.5;
        if (f.y > height) {
          f.y = 0;
          f.x = Math.random() * width;
        }
      });
    }

    function animate() {
      drawSnow();
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }, []);

  const messages = [
    { name: "佐藤", text: "一緒に働けて本当に楽しかったです！新天地でも頑張って！" },
    { name: "鈴木", text: "飲み会の幹事おつかれ！また集まろう！" },
    { name: "田中", text: "いつも明るくて職場が明るくなってたよ！ありがとう！" },
    { name: "増田", text: "次の職場でもその笑顔でがんばって！応援してます！" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col items-center text-center overflow-hidden">
      {/* 背景エフェクト */}
      <canvas id="snow" className="fixed inset-0 z-0 pointer-events-none"></canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,240,200,0.25),transparent_70%)] animate-glow"></div>

      {/* 写真 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8 }}
        className="mt-24 z-10"
      >
        <img
          src="/douki.jpg"
          alt="同期の集合写真"
          className="rounded-2xl shadow-2xl w-4/5 max-w-2xl mx-auto border-4 border-white/80 ring-4 ring-blue-100/60"
        />
      </motion.div>

      {/* メッセージ */}
      <div className="mt-32 w-full max-w-2xl px-6 z-10">
        {messages.map((msg, i) => (
          <div
            key={i}
            className="fade-in opacity-0 translate-y-8 transition-all duration-1000 mb-10 bg-white/70 p-6 rounded-2xl shadow-lg backdrop-blur-sm border border-blue-100/60 hover:shadow-blue-100/40 hover:border-blue-200/80"
          >
            <p className="text-lg text-gray-700 mb-3 leading-relaxed">{msg.text}</p>
            <p className="text-right text-sm text-gray-500">- {msg.name}</p>
          </div>
        ))}
      </div>

      <footer className="text-gray-400 text-sm mt-20 mb-10 z-10">
        <p>With love from your colleagues ❄️</p>
      </footer>

      <style>{`
        .fade-in.show {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        @keyframes glow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
        .animate-glow { animation: glow 10s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
