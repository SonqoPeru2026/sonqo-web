// Único punto que toca exceljs: genera el Excel del reporte mensual como Buffer.
import ExcelJS from "exceljs";
import { packageName, DEFAULT_CURRENCY } from "@/lib/donation";
import type { DonationRow } from "@/lib/donations";

const CURRENCY_FMT = '"S/" #,##0.00';
const DATE_FMT = "dd/mm/yyyy hh:mm";

interface Column {
  header: string;
  width: number;
  value: (row: DonationRow) => string | number | Date | null;
  numFmt?: string;
}

const COLUMNS: Column[] = [
  { header: "Fecha aprobación", width: 20, numFmt: DATE_FMT, value: (r) => (r.approved_at ? new Date(r.approved_at) : null) },
  { header: "Nombre", width: 18, value: (r) => r.first_name ?? "" },
  { header: "Apellido", width: 18, value: (r) => r.last_name ?? "" },
  { header: "Email", width: 28, value: (r) => r.payer_email ?? "" },
  { header: "Teléfono", width: 16, value: (r) => r.phone ?? "" },
  { header: "Paquete", width: 22, value: (r) => packageName(r.package_id) },
  { header: "Monto", width: 14, numFmt: CURRENCY_FMT, value: (r) => Number(r.amount) || 0 },
  { header: "Moneda", width: 10, value: (r) => r.currency ?? DEFAULT_CURRENCY },
  { header: "Método pago", width: 16, value: (r) => r.payment_method ?? "" },
  { header: "Payment ID", width: 24, value: (r) => r.payment_id },
];

const HEADER_BG = "FFE4003F"; // crimson de la marca (ARGB)

// Workbook con las donaciones del mes + fila TOTAL. Con rows vacío: headers + total 0.
export async function buildDonationsWorkbook(rows: DonationRow[], label: string): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Sonqo Perú";
  wb.created = new Date();

  const ws = wb.addWorksheet(`Donaciones ${label}`, {
    views: [{ state: "frozen", ySplit: 1 }], // header fijo al hacer scroll
  });

  ws.columns = COLUMNS.map((c) => ({ header: c.header, width: c.width }));

  // Estilo de la fila de encabezado.
  const headerRow = ws.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_BG } };
  headerRow.alignment = { vertical: "middle" };

  for (const row of rows) {
    const added = ws.addRow(COLUMNS.map((c) => c.value(row)));
    COLUMNS.forEach((c, i) => {
      if (c.numFmt) added.getCell(i + 1).numFmt = c.numFmt;
    });
  }

  // Fila TOTAL (columna Monto). AutoFilter sobre los encabezados de datos.
  ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: COLUMNS.length } };
  const total = rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const montoColIndex = COLUMNS.findIndex((c) => c.header === "Monto") + 1;
  const totalRow = ws.addRow([]);
  totalRow.getCell(montoColIndex - 1).value = "TOTAL";
  totalRow.getCell(montoColIndex - 1).font = { bold: true };
  const totalCell = totalRow.getCell(montoColIndex);
  totalCell.value = total;
  totalCell.numFmt = CURRENCY_FMT;
  totalCell.font = { bold: true };

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
