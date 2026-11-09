# RideShare Routing Structure (Next.js App Router)

app/

- page.tsx (navigation hub / landing)
- layout.tsx
- globals.css
- auth/
  - register/page.tsx
  - login/page.tsx
  - forgot-password/page.tsx
- onboarding/
  - role-selection/page.tsx
- profile/
  - page.tsx
- dashboard/
  - page.tsx
- rides/
  - search/page.tsx
  - post/page.tsx
  - booking/[rideId]/page.tsx
  - status/[rideId]/page.tsx
  - review/[rideId]/page.tsx
- admin/
  - login/page.tsx

components/

- dashboard/DashboardView.tsx
- rides/RideSearchFilters.tsx
- rides/RideBookingPanel.tsx

state/

- useRideFiltersStore.ts

lib/

- api.ts
