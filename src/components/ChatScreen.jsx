import { useState, useRef, useEffect } from "react";

const WEBHOOK_URL = "https://webhook.illo.app.br/webhook/2ec26d13-bdfe-4b42-9a6c-5c9243a668d8";

export default function ChatScreen({ userData, onReset }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Envie uma mensagem para iniciar a conversa.", isUser: false },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleReset = async () => {
    if (window.confirm("Tem certeza que deseja reiniciar o atendimento?")) {
      try {
        // Envia o telefone para o webhook de reset
        await fetch("https://webhook.illo.app.br/webhook/aa78aabd-aa19-4717-91ed-8f55a162ec4d", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone: userData.phone }),
        });
      } catch (error) {
        console.error("Erro ao enviar webhook de reinício:", error);
      }
      onReset();
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;

    // 1. Mostrar mensagem do usuário
    const newUserMsg = { id: Date.now(), text, isUser: true };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputText("");

    // 2. Mostrar "digitando..."
    setIsTyping(true);

    try {
      // 3. Enviar para Webhook
      const payload = {
        message: text,
        name: userData.name,
        phone: userData.phone,
      };

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setIsTyping(false);

      if (!response.ok) {
        throw new Error("Erro na comunicação com o servidor.");
      }

      const responseData = await response.json();
      
      let dataToProcess = responseData;
      if (Array.isArray(responseData) && responseData.length > 0) {
        dataToProcess = responseData[0];
      }

      let botMessageText = "Mensagem recebida, mas formato de resposta não identificado.";

      if (typeof dataToProcess === "string") {
        botMessageText = dataToProcess;
      } else if (dataToProcess.output) {
        botMessageText = dataToProcess.output;
      } else if (dataToProcess.response) {
        botMessageText = dataToProcess.response;
      } else if (dataToProcess.message) {
        botMessageText = dataToProcess.message;
      } else if (dataToProcess.text) {
        botMessageText = dataToProcess.text;
      } else {
        botMessageText = JSON.stringify(responseData, null, 2);
      }

      const newBotMsg = { id: Date.now() + 1, text: botMessageText, isUser: false };
      setMessages((prev) => [...prev, newBotMsg]);
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, text: "Desculpe, ocorreu um erro ao enviar sua mensagem.", isUser: false },
      ]);
    }
  };

  return (
    <div className="screen active">
      <div className="chat-header">
        <img
          src="https://www.aracajucompras.se.gov.br/portal/img/aracaju-2025.png"
          alt="Logo Aracaju"
          className="chat-avatar-img"
        />
        <div className="chat-info">
          <h3>Atendente Virtual</h3>
          <p>
            <i className="fa-solid fa-circle" style={{ fontSize: "8px", marginRight: "4px" }}></i> Online
          </p>
        </div>
        <button className="btn-reset" onClick={handleReset} title="Reiniciar Conversa">
          <i className="fa-solid fa-rotate-right"></i>
        </button>
      </div>

      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.isUser ? "msg-user" : "msg-bot"}`}>
            <div className="message-content">{msg.text}</div>
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator active">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          placeholder="Digite sua mensagem aqui..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          autoComplete="off"
        />
        <button className="btn-send" onClick={handleSend}>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}
