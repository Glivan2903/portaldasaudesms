export default function IntroScreen({ onStart }) {
  return (
    <div className="screen active intro-screen">
      <img
        src="https://www.aracajucompras.se.gov.br/portal/img/aracaju-2025.png"
        alt="Prefeitura de Aracaju"
        className="main-logo"
      />
      <h1 className="intro-title">Portal Mais Saúde</h1>
      <p className="intro-text">
        Bem-vindo ao novo assistente virtual da Secretaria Municipal da Saúde de Aracaju. Uma experiência rápida, humanizada e inteligente para atender nossa população.
      </p>
      <button className="btn-primary" onClick={onStart}>
        Iniciar Teste <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
}
