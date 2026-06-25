import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { ClientsProvider } from "./context/ClientsContext";
import { InventoryProvider } from "./context/InventoryContext";
import { TemplatesProvider } from "./context/TemplatesContext";
import { TreasuryProvider } from "./context/TreasuryContext";
import { PawnProvider } from "./context/PawnContext";
import Home from "./pages/Dashboard/Home";
import ClientsPage from "./pages/Clients/ClientsPage";
import ClientDetailsPage from "./pages/Clients/ClientDetailsPage";
import KhazinaPage from "./pages/Khazina/KhazinaPage";
import PacksPage from "./pages/Packs/PacksPage";
import ProductsPage from "./pages/Products/ProductsPage";
import SuppliersPage from "./pages/Suppliers/SuppliersPage";
import SupplierDetailsPage from "./pages/Suppliers/SupplierDetailsPage";
import TasalomPage from "./pages/Tasalom/TasalomPage";
import SellPage from "./pages/Sell/SellPage";
import Moutaba3tBay3ElBadha2i3Page from "./pages/Sell/Moutaba3tBay3ElBadha2i3Page";
import Mou3aljaBilRhanPage from "./pages/Sell/Mou3aljaBilRhanPage";
import TemplatesPage from "./pages/Templates/TemplatesPage";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <ClientsProvider>
          <InventoryProvider>
            <TreasuryProvider>
              <PawnProvider>
              <TemplatesProvider>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route index path="/" element={<Home />} />
                    <Route path="/sell" element={<SellPage />} />
                    <Route path="/mou3alja-bil-rhan" element={<Mou3aljaBilRhanPage />} />
                    <Route
                      path="/moutaba3t-bay3-el-badha2i3"
                      element={<Moutaba3tBay3ElBadha2i3Page />}
                    />
                    <Route path="/templates" element={<TemplatesPage />} />
                    <Route path="/clients" element={<ClientsPage />} />
                    <Route path="/clients/:id" element={<ClientDetailsPage />} />
                    <Route path="/packs" element={<PacksPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/suppliers" element={<SuppliersPage />} />
                    <Route path="/suppliers/:id" element={<SupplierDetailsPage />} />
                    <Route path="/tasalom-bidha3a" element={<TasalomPage />} />
                    <Route path="/khazina" element={<KhazinaPage />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </TemplatesProvider>
              </PawnProvider>
            </TreasuryProvider>
          </InventoryProvider>
        </ClientsProvider>
      </Router>
    </>
  );
}
