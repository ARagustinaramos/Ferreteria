import { Inter, Montserrat } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import Header from "./components/Header";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Distribuidora DHM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.className} ${montserrat.className}`}>
      <body className="relative">

        {/* ⭐ Marca de agua */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: "url('/marcaagua.png')",
            backgroundPosition: "center top 150px",
            backgroundRepeat: "no-repeat",
            backgroundSize: "800px",
            backgroundAttachment: "fixed",
            opacity: 0.80,
          }}
        />

        {/* ⭐ Contenido */}
        <div className="relative z-10 min-h-screen">
          <AuthProvider>
            <Header />
            {children}
          </AuthProvider>
        </div>

      </body>
    </html>
  );
}

