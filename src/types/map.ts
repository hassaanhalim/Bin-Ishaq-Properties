export interface MasterPlanMap {
  id: string;
  title: string;
  society: string; // 'MPCHS Multi Gardens B-17' | 'Faisal Town Islamabad' | 'Faisal Town Phase 2' | 'Faisal Hills Islamabad' | 'Bahria Town Islamabad / Rawalpindi' | 'Other Societies & Areas'
  sector?: string; // e.g. 'Sector A to G', 'Executive Block', 'Phase 8'
  thumbnailUrl: string;
  pdfUrl: string;
  fileSize?: string; // e.g. '3.5 MB'
  downloadsCount: number;
  createdAt: string;
  updatedAt: string;
}
