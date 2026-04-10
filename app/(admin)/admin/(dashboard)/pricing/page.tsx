import { getExchangeRate } from "@/lib/syscom-client";
import { PageShell, Section } from "@/components/admin/ui/PageShell";
import { StatCard, StatGrid } from "@/components/admin/ui/StatCard";
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import PercentIcon from "@mui/icons-material/Percent";
import ReceiptIcon from "@mui/icons-material/Receipt";

const MARGIN = 0.35;
const IVA = 0.16;

export default async function PricingPage() {
  const fx = await getExchangeRate();

  // Example pricing calculations
  const examples = [
    { name: "Producto económico", costoUsd: 25 },
    { name: "Cámara mid-range", costoUsd: 90 },
    { name: "Switch empresarial", costoUsd: 250 },
    { name: "NVR 16 canales", costoUsd: 500 },
    { name: "Kit videovigilancia", costoUsd: 1000 },
  ];

  const rows = examples.map(ex => {
    const costoMxn = ex.costoUsd * fx;
    const venta = Math.ceil(costoMxn * (1 + MARGIN) * (1 + IVA) * 100) / 100;
    const ganancia = venta - costoMxn * (1 + IVA);
    return {
      ...ex,
      costoMxn: costoMxn.toFixed(2),
      costoConIva: (costoMxn * (1 + IVA)).toFixed(2),
      venta: venta.toFixed(2),
      ganancia: ganancia.toFixed(2),
    };
  });

  return (
    <PageShell title="Listas de precios" subtitle="Configuración de márgenes y tipo de cambio">
      <StatGrid>
        <StatCard
          title="Tipo de cambio"
          value={`$${fx.toFixed(2)} MXN`}
          icon={<CurrencyExchangeIcon />}
          color="#1090e0"
        />
        <StatCard
          title="Margen de ganancia"
          value={`${(MARGIN * 100).toFixed(0)}%`}
          icon={<PercentIcon />}
          color="#f59e0b"
        />
        <StatCard
          title="IVA"
          value={`${(IVA * 100).toFixed(0)}%`}
          icon={<ReceiptIcon />}
          color="#10b981"
        />
        <StatCard
          title="Multiplicador total"
          value={`×${((1 + MARGIN) * (1 + IVA)).toFixed(2)}`}
          icon={<PercentIcon />}
          color="#6366f1"
        />
      </StatGrid>

      <Paper sx={{ mt: 3, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <Typography variant="h6" sx={{ p: 2, fontWeight: 600, borderBottom: "1px solid #e5e7eb" }}>
          Simulador de precios
        </Typography>
        <Typography variant="body2" sx={{ px: 2, py: 1, color: "text.secondary", bgcolor: "#f9fafb" }}>
          Fórmula: Costo USD × Tipo de cambio × (1 + {(MARGIN * 100).toFixed(0)}% margen) × (1 + {(IVA * 100).toFixed(0)}% IVA) = Precio final
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: "#f9fafb" }}>Ejemplo</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, bgcolor: "#f9fafb" }}>Costo USD</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, bgcolor: "#f9fafb" }}>Costo MXN</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, bgcolor: "#f9fafb" }}>Costo + IVA</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, bgcolor: "#f9fafb", color: "primary.main" }}>Precio venta</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, bgcolor: "#f9fafb", color: "success.main" }}>Ganancia</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.name} hover>
                  <TableCell sx={{ fontSize: 13 }}>{row.name}</TableCell>
                  <TableCell align="right" sx={{ fontSize: 13 }}>${row.costoUsd.toFixed(2)} USD</TableCell>
                  <TableCell align="right" sx={{ fontSize: 13 }}>${row.costoMxn} MXN</TableCell>
                  <TableCell align="right" sx={{ fontSize: 13 }}>${row.costoConIva} MXN</TableCell>
                  <TableCell align="right" sx={{ fontSize: 13, fontWeight: 700, color: "primary.main" }}>${row.venta} MXN</TableCell>
                  <TableCell align="right" sx={{ fontSize: 13, fontWeight: 600, color: "success.main" }}>${row.ganancia} MXN</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </PageShell>
  );
}
