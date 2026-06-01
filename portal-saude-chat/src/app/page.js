"use client";
import { useState } from "react";
import IntroScreen from "../components/IntroScreen";
import FormScreen from "../components/FormScreen";
import ChatScreen from "../components/ChatScreen";

export default function Home() {
  const [activeScreen, setActiveScreen] = useState("intro"); // 'intro', 'form', 'chat'
  const [userData, setUserData] = useState({ name: "", phone: "" });

  const handleStartForm = () => setActiveScreen("form");
  
  const handleStartChat = (data) => {
    setUserData(data);
    setActiveScreen("chat");
  };

  const handleReset = () => {
    setUserData({ name: "", phone: "" });
    setActiveScreen("intro");
  };

  return (
    <div className="app-container">
      {activeScreen === "intro" && <IntroScreen onStart={handleStartForm} />}
      {activeScreen === "form" && <FormScreen onChatStart={handleStartChat} />}
      {activeScreen === "chat" && <ChatScreen userData={userData} onReset={handleReset} />}
    </div>
  );
}
