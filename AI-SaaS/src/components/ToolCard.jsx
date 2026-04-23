import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { MdImage } from "react-icons/md";
import { FaFileAlt, FaVideo } from "react-icons/fa";

export default function ToolCard({ tool }) {
  const getIcon = (type) => {
    switch (type) {
      case "image":
        return <MdImage size={38} color="#8fb0ff" />;
      case "resume":
        return <FaFileAlt size={38} color="#8fb0ff" />;
      case "video":
        return <FaVideo size={38} color="#8fb0ff" />;
      default:
        return <MdImage size={38} color="#8fb0ff" />;
    }
  };

  return (
    <div
      className="tool-card"
      style={{
        background: "linear-gradient(180deg, rgba(16, 31, 50, 0.94) 0%, rgba(10, 22, 37, 0.98) 100%)",
        border: "1px solid rgba(149, 176, 214, 0.16)",
        borderRadius: "22px",
        padding: "28px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 18px 40px rgba(3, 8, 20, 0.26)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 30px 80px rgba(3, 8, 20, 0.42)";
        e.currentTarget.style.borderColor = "rgba(124, 156, 255, 0.42)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 18px 40px rgba(3, 8, 20, 0.26)";
        e.currentTarget.style.borderColor = "rgba(149, 176, 214, 0.16)";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",
          background: "linear-gradient(135deg, #7c9cff 0%, #5eead4 100%)",
          transform: "scaleX(0)",
          transition: "transform 0.3s ease",
        }}
        className="tool-card-bar"
      />

      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "18px",
          background: "linear-gradient(135deg, rgba(124, 156, 255, 0.16) 0%, rgba(94, 234, 212, 0.18) 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {getIcon(tool.type)}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        {tool.category ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 10px",
              borderRadius: "999px",
              background: "rgba(124, 156, 255, 0.14)",
              color: "#c8d8ff",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {tool.category}
          </span>
        ) : (
          <span />
        )}

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "6px 12px",
            borderRadius: "999px",
            background: Number(tool.price) > 0 ? "rgba(244, 162, 97, 0.16)" : "rgba(52, 211, 153, 0.14)",
            color: Number(tool.price) > 0 ? "#ffd1ac" : "#9cf0cb",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          {Number(tool.price) > 0 ? `Rs. ${tool.price}` : "Free"}
        </span>
      </div>

      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "12px",
          color: "#f7fafc",
        }}
      >
        {tool.name}
      </h3>

      <p
        style={{
          color: "#8fa5c2",
          fontSize: "14px",
          lineHeight: "1.6",
          marginBottom: "20px",
        }}
      >
        {tool.description}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          color: "#c8d8ff",
          fontWeight: "600",
          fontSize: "14px",
        }}
      >
        <span>{Number(tool.price) > 0 ? "Buy now" : "Open tool"}</span>
        <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: "12px" }} />
      </div>
    </div>
  );
}
