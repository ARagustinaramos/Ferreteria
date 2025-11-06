import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const priceLists = [
  { id: 1, name: "Lista de Precios 1", formats: ["pdf", "excel"] },
  { id: 2, name: "Lista de Precios 2", formats: ["pdf", "excel"] },
  { id: 3, name: "Lista de Precios 3", formats: ["pdf", "excel"] },
  { id: 4, name: "Lista de Precios 4", formats: ["pdf", "excel"] },
  { id: 5, name: "Lista de Precios 5", formats: ["pdf", "excel"] },
  { id: 6, name: "Ofertas", formats: ["pdf"] },
  { id: 7, name: "Máquinas", formats: ["pdf"] },
];

export default function PriceListsPanel() {
  const handleMockUpload = (name, format) => {
    alert(`Simulación: se subiría ${name} (${format.toUpperCase()})`);
  };

  return (
    <Card className="mt-8 bg-gray-50 border shadow-md">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">📄 Listas de Precios</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {priceLists.map((list) => (
            <div
              key={list.id}
              className="flex flex-col items-start p-3 bg-white rounded-xl shadow-sm border"
            >
              <span className="font-medium mb-2">{list.name}</span>
              <div className="flex gap-2">
                {list.formats.includes("pdf") && (
                  <Button
                    variant="default"
                    className="bg-gray-800 text-white hover:bg-gray-700"
                    onClick={() => handleMockUpload(list.name, "pdf")}
                  >
                    Cargar PDF
                  </Button>
                )}
                {list.formats.includes("excel") && (
                  <Button
                    variant="default"
                    className="bg-green-700 text-white hover:bg-green-600"
                    onClick={() => handleMockUpload(list.name, "excel")}
                  >
                    Cargar Excel
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
