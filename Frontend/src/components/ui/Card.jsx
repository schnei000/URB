export default function Card({ title, children, style = {} }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        marginBottom: "20px",
        ...style
      }}
    >
      {/* Titre si fourni */}
      {title && (
        <h3
          style={{
            marginBottom: "15px",
            fontSize: "18px",
            fontWeight: "600",
            color: "#111827"
          }}
        >
          {title}
        </h3>
      )}

      {/* Contenu */}
      <div>{children}</div>
    </div>
  );
}
