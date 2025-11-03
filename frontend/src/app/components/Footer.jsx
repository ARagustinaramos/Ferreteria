export default function Footer() {
    return (
      <footer className="bg-gray-100 text-center py-6 mt-10 border-t">
        <div className="text-sm text-gray-700 space-y-1">
          <p className="text-red-600 font-semibold">
            PARA PODER INGRESAR A LA LISTA DE PRECIOS
          </p>
          <p>
            <span className="text-red-700 font-semibold">
              COMUNICATE CON NOSOTROS
            </span>
          </p>
  
          <div className="mt-3">
            <p>📞 11E-09</p>
            <p>
              📧{" "}
              <a
                href="mailto:herrajes123@gmail.com"
                className="text-blue-700 underline"
              >
                herrajes123@gmail.com
              </a>
            </p>
            <p className="mt-2">🚚 Realizamos los envíos hasta el local</p>
          </div>
        </div>
      </footer>
    );
  }
  