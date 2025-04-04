import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import { ProductPage } from "./components/products/ProductPage";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TransactionProvider } from "./context/TransactionContext";
import { Toaster } from "./components/ui/toaster";
import { TransactionPage } from "./components/transaction/TransactionPage";
import { PaymentWaitingPage } from "./components/transaction/PaymentWaitingPage";
import { PaymentSuccessPage } from "./components/transaction/PaymentSuccessPage";
import { AdminLoginPage } from "./components/admin/AdminLoginPage";
import { AdminTransactionsPage } from "./components/admin/AdminTransactionsPage";
import { AdminConfirmationPage } from "./components/admin/AdminConfirmationPage";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import AdminDashboard from "./components/admin/AdminDashboard";

// Protected route component for regular users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <CartProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              {/* User routes */}
              <Route path="/" element={<LoginForm />} />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <ProductPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transaction"
                element={
                  <ProtectedRoute>
                    <TransactionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/waiting"
                element={
                  <ProtectedRoute>
                    <PaymentWaitingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment/success"
                element={
                  <ProtectedRoute>
                    <PaymentSuccessPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/transactions"
                element={
                  <AdminProtectedRoute>
                    <AdminTransactionsPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/transactions/:transactionId"
                element={
                  <AdminProtectedRoute>
                    <AdminConfirmationPage />
                  </AdminProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </div>
        </CartProvider>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;
