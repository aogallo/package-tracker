# UX/UI Design Prompt for Stitch

## App Concept

**Package Tracker GT** — A professional, reliable package delivery tracking system for businesses in Guatemala. The app serves two main user groups:

1. **Admins** (business staff): Create orders, manage clients, update delivery status, generate tickets, and view reports
2. **Clients** (recipients): Track their packages via a public URL without authentication

**Personality**: Professional, trustworthy, efficient. Clean and modern but not cold. Designed for busy staff who need to process many orders quickly, and clients who need clear, understandable status updates.

---

## Color Palette

### Primary Colors

- **Primary Blue**: `#2563eb` (rgb(37, 99, 235)) — Main actions, links, brand identity
- **Primary Dark**: `#1e40af` (rgb(30, 64, 175)) — Hover states, emphasis
- **Primary Light**: `#dbeafe` (rgb(219, 234, 254)) — Backgrounds, badges

### Status Colors

| Status     | Background | Text      |
| ---------- | ---------- | --------- |
| Pending    | `#fef3c7`  | `#92400e` |
| Confirmed  | `#dbeafe`  | `#1e40af` |
| In Transit | `#ede9fe`  | `#5b21b6` |
| Delivered  | `#d1fae5`  | `#065f46` |
| Picked Up  | `#d1fae5`  | `#065f46` |
| Canceled   | `#fee2e2`  | `#991b1b` |

### Neutral Colors

- **Background**: `#ffffff` (white)
- **Surface**: `#f8fafc` (light gray-blue)
- **Border**: `#e2e8f0` (soft gray)
- **Text Primary**: `#1e293b` (dark slate)
- **Text Secondary**: `#64748b` (medium gray)
- **Text Muted**: `#94a3b8` (light gray)

---

## Typography

### Font Stack

- **Primary**: Inter (Google Fonts) — clean, highly readable
- **Fallback**: system-ui, -apple-system, sans-serif

### Type Scale

| Element       | Size             | Weight         | Line Height |
| ------------- | ---------------- | -------------- | ----------- |
| Page Title    | 30px / 1.875rem  | 700 (Bold)     | 1.2         |
| Section Title | 20px / 1.25rem   | 600 (Semibold) | 1.3         |
| Card Title    | 18px / 1.125rem  | 600 (Semibold) | 1.3         |
| Body Text     | 16px / 1rem      | 400 (Regular)  | 1.5         |
| Labels        | 14px / 0.875rem  | 500 (Medium)   | 1.4         |
| Table Header  | 13px / 0.8125rem | 600 (Semibold) | 1.2         |
| Table Cell    | 15px / 0.9375rem | 400 (Regular)  | 1.4         |
| Small/Caption | 12px / 0.75rem   | 400 (Regular)  | 1.4         |

### Principles

- **Minimum body text**: 16px — never go below for readability
- **Important text** (labels, headings): Use `font-medium` (500) or `font-semibold` (600), NOT `font-normal` (400)
- **Contrast**: Ensure text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)

---

## Layout & Spacing

### Container Widths

- **Max container**: 1280px (max-w-7xl)
- **Form max width**: 896px (max-w-4xl)
- **Card max width**: 576px (max-w-2xl)

### Spacing Scale

- **Section padding**: 40px (py-10)
- **Card padding**: 24px (p-6)
- **Element gap**: 16px (gap-4)
- **Form field gap**: 8px (gap-2)

### Grid Layouts

- **Stats cards**: 4 columns on desktop, 2 on tablet, 1 on mobile
- **Form fields**: 2 columns on desktop, 1 on mobile
- **Tables**: Full width with horizontal scroll on mobile

---

## Component Styles

### Buttons

**Primary Button**

- Background: Primary Blue (`#2563eb`)
- Text: White
- Padding: 10px 16px
- Border radius: 8px (rounded-lg)
- Hover: Primary Dark (`#1e40af`)
- Font weight: 500

**Secondary Button (Outline)**

- Background: Transparent
- Border: 1px solid border color
- Text: Primary text color
- Hover: Light gray background

**Destructive Button**

- Background: `#dc2626` (red-600)
- Text: White

### Form Inputs

- Border: 1px solid `#e2e8f0`
- Border radius: 8px
- Padding: 10px 12px
- Font size: 16px (important for mobile!)
- Focus ring: 2px primary blue
- Label: Above input, font-weight 500, margin-bottom 4px

### Cards

- Background: White
- Border: 1px solid `#e2e8f0`
- Border radius: 12px (rounded-xl)
- Shadow: Subtle (shadow-sm)
- Padding: 24px

### Tables

- Header: Light gray background (`#f8fafc`), uppercase text
- Rows: White with bottom border
- Hover: Very light blue tint (`#f1f5f9`)
- Cell padding: 12px vertical, 16px horizontal

### Badges

- Border radius: 9999px (full/pill)
- Padding: 4px 12px
- Font size: 12px
- Font weight: 600
- Status colors from palette above

### Navigation Sidebar

- Width: 256px (w-64)
- Background: Slightly off-white
- Active item: Light blue background with primary text
- Icons: 16px, muted color, primary when active

---

## Motion & Animation

### Principles

- **Purposeful**: Animate to show state changes, not just for decoration
- **Quick**: 150-300ms for most interactions
- **Subtle**: Use opacity and transform, not dramatic movements

### Recommended Animations

- **Button hover**: Scale 1.02, slight shadow increase
- **Modal/Dropdown**: Fade in + slide down 4px
- **Page transitions**: Fade (200ms)
- **Loading states**: Pulse or subtle spin
- **Toast notifications**: Slide in from top, auto-dismiss after 5s

### Easing

- Default: `ease-out`
- Bouncy elements: `cubic-bezier(0.68, -0.55, 0.265, 1.55)`

---

## Mobile Considerations

### Responsive Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### Mobile-First Guidelines

1. **Touch targets**: Minimum 44x44px for all clickable elements
2. **Input size**: 16px font prevents iOS zoom on focus
3. **Tables**: Horizontal scroll with sticky first column
4. **Forms**: Single column, full-width inputs
5. **Navigation**: Hamburger menu on mobile, sidebar on desktop
6. **Spacing**: Increase padding on mobile for easier tapping

### Safe Areas

- Account for notches and home indicators
- Use `env(safe-area-inset-*)` where needed

---

## Spanish-First Design

### Language Context

- **Primary language**: Spanish (Guatemala)
- **Audience**: Guatemalan businesses and clients
- **Locale**: es-GT

### Label Examples

| Concept   | Spanish Label |
| --------- | ------------- |
| Dashboard | Panel         |
| Orders    | Órdenes       |
| Clients   | Clientes      |
| Create    | Crear         |
| Edit      | Editar        |
| Delete    | Eliminar      |
| Download  | Descargar     |
| Status    | Estado        |
| Search    | Buscar        |
| Filter    | Filtrar       |

### Date/Number Formatting

- **Dates**: dd MMM yyyy (ej: 16 abr 2026)
- **Numbers**: 1,234.56 (US format with Spanish labels)
- **Currency**: Q1,234.56 (Quetzal Guatemalteco)

---

## Key Pages to Design

### 1. Admin Dashboard (`/admin`)

- Welcome message with admin name
- Stats cards: Orders today, pending, in transit, delivered
- Recent orders preview

### 2. Orders List (`/admin/orders`)

- Table with: Tracking #, Client, Type, Status, Date, Actions
- Status badges with colors
- "Crear Orden" button prominent

### 3. Create Order Form (`/admin/orders/new`)

- Searchable client dropdown
- Guest/registered client toggle
- Dynamic items (add/remove)
- URL field per item
- Delivery address fields

### 4. Order Detail (`/admin/orders/[id]`)

- Order header with tracking number
- Status update dropdown
- Customer info card
- Delivery info card
- Items table with URL links
- Download ticket button

### 5. Public Tracking (`/track/[trackingNumber]`)

- Clean, public-facing page
- Large tracking number display
- Status badge
- Timeline of delivery stages
- Items list

### 6. Reports (`/admin/reports`)

- Metric cards with counts
- Filters: date range, client, status
- Orders table
- Export CSV button

---

## Accessibility Requirements

1. **Color contrast**: WCAG AA minimum
2. **Keyboard navigation**: All interactions possible without mouse
3. **Screen readers**: Proper ARIA labels, semantic HTML
4. **Focus indicators**: Visible focus rings on all interactive elements
5. **Error messages**: Clear, associated with specific fields
6. **Loading states**: Indicate async operations clearly

---

## Design Assets

### Icons

- Use Lucide icons (consistent, clean line icons)
- Size: 16px for nav, 20px for cards, 24px for features
- Stroke width: 2px standard

### Empty States

- Friendly illustrations or icons
- Clear message explaining the empty state
- Action button when applicable

### Error States

- Red color for errors
- Icon + message format
- Clear recovery action

---

## Export Specifications

When exporting for development:

- **Format**: Figma, Sketch, or exported PNG/SVG
- **Components**: Individual components with all states (default, hover, active, disabled)
- **Colors**: Use hex codes from this document
- **Spacing**: Use 4px baseline grid
- **Typography**: Match the type scale exactly
