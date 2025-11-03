import { AuthProvider } from "./context/AuthContext";
import "../../src/styles/tailwind.css";

export const metadata = {
  title: "Distribuidora DHM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
