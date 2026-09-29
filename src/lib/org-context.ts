import { OrganizationContext, UnitOption } from "@/types";

export const DEFAULT_UNITS: UnitOption[] = [
  {
    id: "UNIT-FIN-01",
    code: "FIN-BOS",
    name: "Keuangan & Penatausahaan BOS",
    description: "Pengelolaan dana BOS Reguler, APBN, APBD dan kewajiban WAPU perpajakan sekolah",
  },
  {
    id: "UNIT-TEFA-02",
    code: "TEFA-VOKASI",
    name: "Unit Produksi & TEFA",
    description: "Kegiatan Teaching Factory, unit usaha jasa perakitan IT, dan kemitraan industri",
  },
  {
    id: "UNIT-YYS-03",
    code: "YAYASAN",
    name: "Tata Usaha & Yayasan Bina Putra",
    description: "Administrasi umum yayasan, sewa sarana gedung sekolah, dan fasilitas pendidikan",
  },
  {
    id: "UNIT-LAB-04",
    code: "LAB-BENGKEL",
    name: "Laboratorium & Bengkel Praktek",
    description: "Pengadaan bahan praktek kejuruan AKL, TKJ, dan pemeliharaan alat lab",
  },
];

export const INITIAL_ORG_CONTEXT: OrganizationContext = {
  tenantId: "TENANT-SMK-BP",
  organizationId: "ORG-BINA-PUTRA-JKT",
  organizationName: "SMK BINA PUTRA JAKARTA",
  unitId: "UNIT-FIN-01",
  unitName: "Keuangan & Penatausahaan BOS",
  periodMonth: 9,
  periodYear: 2026,
  periodLabel: "September 2026",
  fiscalYear: "2026",
  operatingMode: "LIVE_INTERNAL",
};
