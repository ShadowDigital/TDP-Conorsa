# Implementation Plan

## Goal Description
Add a new admin‑only page **Informe** under the **Control de Horas** menu. The page will let admin users select a **"Desde"** (start) and **"Hasta"** (end) date, then generate an **Excel** report containing all attendance (jornadas) for every user in that range.

## User Review Required
- Confirm the desired filename for the generated Excel (e.g., `informe_asistencia.xlsx`).
- Approve the UI design for the date pickers and button (we will use native HTML `input[type="date"]` with custom styling).

## Open Questions
> [!IMPORTANT]
> Do you need any extra columns in the Excel (e.g., user email, role) beyond the default fields (`id`, `userId`, `tipo`, `fecha_hora`, `motivo_pausa`)?

## Proposed Changes
---
### Frontend
- **[MODIFY]** `src/components/MainLayout.tsx` – already added child menu item and nested rendering logic.
- **[MODIFY]** `src/App.tsx` – import `AsistenciaInformePage` and add route `/admin/asistencia/informe`.
- **[NEW]** `src/pages/admin/AsistenciaInformePage.tsx` – page component with two `input[type="date"]`, a **Generar Informe** button, and logic to call the new API endpoint and trigger file download.
- **[MODIFY]** `src/api/asistenciaApi.ts` – add function `generarInforme(desde: string, hasta: string)` that sends a GET request to `/asistencia/informe?desde=...&hasta=...` and returns a Blob.
- **[MODIFY]** Ensure the route is wrapped by `AdminRoute` (already done via `App.tsx`).

---
### Backend (NestJS)
- **[NEW]** DTO `src/asistencia/dto/generar-informe.dto.ts` with `desde: string` and `hasta: string` (validated as ISO dates).
- **[MODIFY]** `src/asistencia/asistencia.controller.ts` – add `@Get('informe')` endpoint (admin only) that accepts query params, calls the service, and streams the generated Excel file with appropriate headers.
- **[MODIFY]** `src/asistencia/asistencia.service.ts` – add method `generarInforme(desde: Date, hasta: Date)`:
  - Query `Asistencia` records with `Between(desde, hasta)`.
  - Use `exceljs` to create a workbook, add a worksheet, write a header row, then write each record (including user email via a join if needed).
  - Return the workbook as a buffer.
- **[NEW]** Install `exceljs` (`npm install exceljs`) – already installed earlier.
- **[MODIFY]** Ensure the endpoint is protected by `AuthGuard` and checks `user?.roles?.includes('admin')` (similar to other admin routes).

---
### Misc
- Update any TypeScript interfaces/types for the new DTO.
- Add minimal CSS for the date pickers to match the app’s design (use Tailwind classes).

## Verification Plan
### Manual Verification
1. Log in as an **admin** user.
2. Navigate to **Control de Horas → Informe**.
3. Pick a start and end date, click **Generar Informe**.
4. Verify the browser downloads an Excel file named `informe_asistencia.xlsx` (or the filename you approved).
5. Open the file – it should list all attendance records for all users within the selected range.
6. Attempt to open the same URL as a non‑admin user; it should return a 403/unauthorized response.

### Automated Tests (optional)
- Add a Jest e2e test that hits `/asistencia/informe` with admin credentials and checks the `Content‑Disposition` header and that the response is a valid Excel buffer.

---
*Please review the plan, answer the open question, and approve so we can proceed with implementation.*
