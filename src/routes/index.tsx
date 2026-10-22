import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tryton ERP - Ventas y Compras" },
      { name: "description", content: "Gestión de terceros, listas de precios, ventas y compras estilo Tryton ERP." },
      { property: "og:title", content: "Tryton ERP - Ventas y Compras" },
      { property: "og:description", content: "Gestión de terceros, listas de precios, ventas y compras estilo Tryton ERP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/tryton.html"
      title="Tryton ERP - Ventas y Compras"
      className="block h-screen w-full border-0"
    />
  );
}
