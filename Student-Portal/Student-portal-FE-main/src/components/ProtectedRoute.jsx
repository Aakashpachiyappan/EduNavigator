import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight:"100vh", background:"#03040a", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
        <div className="fx-grid-bg" />
        <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
          <div style={{ width:50, height:50, border:"2px solid rgba(0,229,255,0.15)", borderTop:"2px solid #00e5ff", borderRadius:"50%", animation:"spin 1s linear infinite", boxShadow:"0 0 20px rgba(0,229,255,0.3)" }} />
          <div style={{ fontFamily:"var(--font-mono)", fontSize:11, color:"rgba(0,229,255,0.5)", letterSpacing:"0.2em" }}>
            VERIFYING CREDENTIALS...
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}
