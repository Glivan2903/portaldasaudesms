import { useState } from "react";

export default function FormScreen({ onChatStart }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Por favor, preencha nome e telefone para continuar.");
      return;
    }

    const sanitizedPhone = phone.replace(/\D/g, "");
    if (sanitizedPhone.length < 10) {
      alert("Por favor, informe um número de telefone válido com DDD.");
      return;
    }

    onChatStart({ name: name.trim(), phone: sanitizedPhone });
  };

  return (
    <div className="screen active form-screen">
      <div className="form-header">
        <h2>Identificação</h2>
        <p>Por favor, informe seus dados para iniciarmos o atendimento.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="userName">Nome Completo</label>
          <input
            type="text"
            id="userName"
            placeholder="Ex: Maria Silva"
            required
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="userPhone">Telefone (WhatsApp)</label>
          <input
            type="tel"
            id="userPhone"
            placeholder="(79) 90000-0000"
            required
            autoComplete="off"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ marginTop: "10px" }}>
          Começar Conversa <i className="fa-solid fa-comment-medical"></i>
        </button>
      </form>
    </div>
  );
}
