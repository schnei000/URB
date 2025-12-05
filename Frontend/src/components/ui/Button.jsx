export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  style = {}
}) {
  // Définition des styles selon le variant
  const variants = {
    primary: {
      background: "#2563eb",
      color: "white"
    },
    danger: {
      background: "#dc2626",
      color: "white"
    },
    outline: {
      background: "transparent",
      border: "1px solid #2563eb",
      color: "#2563eb"
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 18px",
        borderRadius: "6px",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        fontSize: "15px",
        ...variants[variant],
        ...style
      }}
    >
      {children}
    </button>
  );
}
