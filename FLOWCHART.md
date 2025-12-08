# Ecommerce Store - Application Flowchart

## Overall System Architecture

```mermaid
graph TD
    A["🌐 Customer/Admin Users"] -->|Browse/Manage| B["Next.js Frontend"]
    B -->|API Calls| C["Next.js Backend/API Routes"]
    C -->|Query/Update| D["Prisma ORM"]
    D -->|Read/Write| E["SQLite Database"]
    
    C -->|Payment Processing| F["Stripe Payment Gateway"]
    F -->|Webhook Events| G["Stripe Webhook Handler"]
    G -->|Update Order Status| D
    G -->|Send Confirmation Email| H["Resend Email Service"]
    
    style A fill:#e1f5ff
    style B fill:#f3e5f5
    style C fill:#f3e5f5
    style D fill:#fce4ec
    style E fill:#fff9c4
    style F fill:#c8e6c9
    style G fill:#c8e6c9
    style H fill:#ffe0b2
```

---

## 1. Customer Purchase Flow

```mermaid
graph TD
    A["Customer Visits Store"] -->|Browse Products| B["Product Listing Page<br/>(customerFacing/products)"]
    B -->|Click Product| C["Product Detail Page<br/>(products/[id])"]
    C -->|Add to Cart| D["Checkout Form<br/>(products/[id]/purchase)"]
    D -->|Enter Payment Info| E["Stripe Checkout Element"]
    E -->|Submit Payment| F["Stripe Payment Processing"]
    
    F -->|Success| G["Stripe Confirms Charge"]
    F -->|Failed| H["Payment Declined"]
    
    G -->|Webhook Event| I["Stripe Webhook Handler<br/>(webhooks/stripe/route.tsx)"]
    
    I -->|Create Order| J["Save Order to Database"]
    I -->|Create Download Link| K["Generate Download Verification"]
    I -->|Send Email| L["Send Purchase Confirmation<br/>via Resend"]
    
    J --> M["Order Created"]
    K --> M
    L --> M
    
    M -->|Redirect| N["Purchase Success Page<br/>(stripe/purchase-success)"]
    
    H -->|Stay on Checkout| D
    
    N -->|Download Product| O["Download Route Handler<br/>(products/download/[id])"]
    O -->|Verify License| P{"Download Token<br/>Valid?"}
    P -->|Yes| Q["Serve File"]
    P -->|No/Expired| R["Redirect to Expired Page"]
    
    style A fill:#e1f5ff
    style B fill:#f3e5f5
    style C fill:#f3e5f5
    style D fill:#f3e5f5
    style E fill:#c8e6c9
    style F fill:#c8e6c9
    style G fill:#c8e6c9
    style H fill:#ffcccc
    style I fill:#fff3e0
    style J fill:#fce4ec
    style K fill:#fce4ec
    style L fill:#ffe0b2
    style M fill:#c8e6c9
    style N fill:#f3e5f5
    style O fill:#fff3e0
    style P fill:#ffcccc
    style Q fill:#c8e6c9
    style R fill:#ffcccc
```

---

## 2. Admin Dashboard Flow

```mermaid
graph TD
    A["Admin User"] -->|Login| B["Admin Dashboard<br/>(admin/page.tsx)"]
    B -->|View Stats| C["Dashboard Overview"]
    B -->|Manage Products| D["Products Page<br/>(admin/products)"]
    
    D -->|Create New| E["New Product Form<br/>(admin/products/new)"]
    D -->|Edit Existing| F["Edit Product Page<br/>(admin/products/[id]/edit)"]
    D -->|Delete/Archive| G["Product Actions<br/>(ProductActions.tsx)"]
    
    E -->|Submit| H["Create Product Action<br/>(admin/_actions/products.ts)"]
    F -->|Submit| I["Update Product Action<br/>(admin/_actions/products.ts)"]
    G -->|Delete| J["Delete Product Action<br/>(admin/_actions/products.ts)"]
    
    H -->|Save to DB| K["Product Saved"]
    I -->|Update in DB| K
    J -->|Remove from DB| K
    
    K -->|Redirect| D
    
    style A fill:#e1f5ff
    style B fill:#f3e5f5
    style C fill:#fff9c4
    style D fill:#f3e5f5
    style E fill:#f3e5f5
    style F fill:#f3e5f5
    style G fill:#f3e5f5
    style H fill:#fce4ec
    style I fill:#fce4ec
    style J fill:#fce4ec
    style K fill:#c8e6c9
```

---

## 3. Database & Data Model Flow

```mermaid
graph TD
    A["Products Table"] -->|Store| B["Product Info<br/>- ID, Name, Price<br/>- File Path, Image<br/>- Description, Status"]
    
    C["Users Table"] -->|Store| D["User Info<br/>- ID, Email<br/>- Created/Updated"]
    
    E["Orders Table"] -->|Link| F["Order Records<br/>- User ID<br/>- Product ID<br/>- Price Paid<br/>- Created/Updated"]
    
    G["DownloadVerifications Table"] -->|Store| H["Download Tokens<br/>- Token ID<br/>- Product ID<br/>- Expires At"]
    
    B -->|1-to-Many| F
    D -->|1-to-Many| F
    B -->|1-to-Many| H
    
    F -->|Cascade on User Delete| D
    F -->|Restrict on Product Delete| B
    H -->|Cascade on Product Delete| B
    
    style A fill:#fff9c4
    style B fill:#fce4ec
    style C fill:#fff9c4
    style D fill:#fce4ec
    style E fill:#fff9c4
    style F fill:#fce4ec
    style G fill:#fff9c4
    style H fill:#fce4ec
```

---

## 4. Authentication & Authorization Flow

```mermaid
graph TD
    A["Request to Protected Route"] -->|Check Middleware| B["Middleware.ts"]
    
    B -->|Verify Auth| C{"Is User<br/>Authenticated?"}
    
    C -->|No Auth Token| D["Redirect to Login"]
    C -->|Valid Admin| E["Allow Admin Access"]
    C -->|Invalid/Not Admin| F["Redirect to Home"]
    
    E -->|Access| G["Admin Routes<br/>(admin/*)"]
    G -->|View/Edit Products| H["Dashboard Access"]
    
    style A fill:#e1f5ff
    style B fill:#fff3e0
    style C fill:#ffcccc
    style D fill:#ffcccc
    style E fill:#c8e6c9
    style F fill:#ffcccc
    style G fill:#f3e5f5
    style H fill:#c8e6c9
```

---

## 5. Email Notification Flow

```mermaid
graph TD
    A["Payment Successful"] -->|Webhook Event| B["Stripe Webhook Handler"]
    B -->|Extract User Email| C["Get Customer Email<br/>from Stripe Charge"]
    
    C -->|Prepare Email| D["Create Email Template<br/>via react-email"]
    D -->|Include Order Details| E["Email Content<br/>- Order ID<br/>- Download Link<br/>- Product Info"]
    
    E -->|Send via| F["Resend Service"]
    F -->|Deliver| G["Customer Email<br/>Inbox"]
    
    style A fill:#c8e6c9
    style B fill:#fff3e0
    style C fill:#fce4ec
    style D fill:#f3e5f5
    style E fill:#ffe0b2
    style F fill:#c8e6c9
    style G fill:#e1f5ff
```

---

## 6. File Download & Verification Flow

```mermaid
graph TD
    A["User Clicks Download"] -->|Click Link| B["Download Route Handler<br/>(products/download/[id]/route.ts)"]
    
    B -->|Extract Token| C["Get Download<br/>Verification ID"]
    
    C -->|Query Database| D["Lookup Verification<br/>in DB"]
    
    D -->|Check Expiry| E{"Token<br/>Valid & Not<br/>Expired?"}
    
    E -->|Yes| F["Increment Download Count<br/>& Cache"]
    E -->|No/Expired| G["Redirect to Expired Page<br/>(products/download/expired)"]
    E -->|Not Found| G
    
    F -->|Serve File| H["Return Product File<br/>from File System"]
    H -->|Download| I["User Downloads File"]
    
    style A fill:#e1f5ff
    style B fill:#fff3e0
    style C fill:#fce4ec
    style D fill:#fce4ec
    style E fill:#ffcccc
    style F fill:#f3e5f5
    style G fill:#ffcccc
    style H fill:#c8e6c9
    style I fill:#e1f5ff
```

---

## Key Components & File Structure

### Frontend Components (`src/components/`)
- **Nav.tsx**: Navigation bar with links
- **ProductCard.tsx**: Product display card
- **UI Components**: Button, Input, Label, Card, Table, Dropdown, Textarea

### API Routes & Actions
- **webhooks/stripe/route.tsx**: Handles Stripe webhook events
- **actions/orders.tsx**: Order management actions
- **admin/_actions/products.ts**: Product CRUD operations

### Pages & Routes
- **(customerFacing)/page.tsx**: Home page
- **(customerFacing)/products/page.tsx**: Product listing
- **(customerFacing)/products/[id]/purchase/page.tsx**: Checkout
- **admin/page.tsx**: Admin dashboard
- **admin/products/**: Product management

### Database & Utilities
- **db/db.ts**: Prisma client instance
- **lib/cache.ts**: Caching logic
- **lib/isValidAuth.ts**: Authentication validation
- **lib/formaters.ts**: Data formatting utilities
- **middleware.ts**: Request middleware for auth checks

---

## Data Flow Summary

```
Customer Journey:
Browse Products → Select Product → Add to Cart → Checkout → 
Stripe Payment → Webhook Confirmation → Database Update → 
Email Sent → Download Link Created → User Downloads File

Admin Journey:
Login → Dashboard → Product Management → Create/Edit/Delete → 
Database Update → Products Updated on Frontend

Security:
All requests → Middleware Auth Check → 
Routes require valid token/session → Protected admin routes
```

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Next.js 15, TailwindCSS |
| **Backend** | Next.js API Routes, TypeScript |
| **Database** | Prisma ORM, SQLite |
| **Payments** | Stripe API |
| **Emails** | Resend, react-email |
| **UI Components** | Radix UI, Lucide Icons |
| **Validation** | Zod |

