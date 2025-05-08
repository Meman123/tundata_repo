"use client";

import rawData from "@/data/datos.json";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type ChartDataItem = { entidad: string; monto: number };

const chartData: ChartDataItem[] = rawData
  .map((d) => ({ entidad: d.nombre_entidad_norm, monto: +d.total_contratado }))
  .sort((a, b) => b.monto - a.monto);

const formatCOP = (v: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(v);

export default function GraficoContratosPorEntidad() {
  return (
    /* 👉  padding global para alejar todo del borde */
    <div className="px-6 sm:px-10">
      <div className="w-full max-w-6xl mx-auto my-8 bg-[#14344b] text-white rounded-xl shadow-md pb-6">
        {/* encabezado */}
        <div className="px-6 pt-8 pb-4">
          <h2 className="text-2xl font-bold mb-2">Gasto Total por Entidad</h2>
          <p className="text-sm text-white/80">
            Monto total contratado por cada entidad en Duitama.
          </p>
        </div>

        {/* gráfico */}
        <div style={{ height: 500 + chartData.length * 5 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 10, right: 30, left: 180, bottom: 20 }}
            >
              <CartesianGrid stroke="#1f4e6b" strokeDasharray="3 3" />
              <XAxis
                type="number"
                tickFormatter={formatCOP}
                stroke="#ccc"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="entidad"
                width={220}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(v) => formatCOP(v as number)}
                contentStyle={{ background: "#1a2f40", border: "none", color: "#fff" }}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Bar dataKey="monto" fill="#f39c12" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* pie de página */}
        <div className="mt-6 text-xs text-center text-white/60">
          Datos actualizados al{" "}
          {new Date().toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          .
        </div>
      </div>
    </div>
  );
}
