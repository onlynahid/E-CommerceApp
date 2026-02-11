/**
 * 401 UNAUTHORIZED - DEBUGGING VE ÇÖZÜM REHBERI
 * 
 * 401 Unauthorized = Backend JWT token'ınızı kabul etmiyor
 * 
 * OLASI NEDENLER:
 * 1. Token localStorage'da yok (login yapılmamış)
 * 2. Token geçerli değil (corrupted, expired, yanlış format)
 * 3. Token Authorization header'da yanlış gönderiliyor
 * 4. Backend JWT secret key değiştirildi (token eski)
 * 5. Token role/permissions yeterli değil (403 olmalıydı)
 * 6. CORS configuration yanlış
 * 7. Backend HTTPS sertifikası geçersiz
 */

export function debugUnauthorized() {
  console.clear();
  console.log("🔍 401 UNAUTHORIZED - TAM TEŞHIS");
  console.log("=".repeat(60));

  // STEP 1: Token var mı?
  console.log("\n📋 STEP 1: localStorage Token Kontrolü");
  const token = localStorage.getItem("token");
  console.log(`Token exists: ${!!token}`);
  if (token) {
    console.log(`Token length: ${token.length} chars`);
    console.log(`Token preview: ${token.substring(0, 50)}...`);
  } else {
    console.error("❌ PROBLEM: Token localStorage'da yok!");
    console.log("✅ ÇÖZÜM: Önce login yap:");
    console.log('  await authApiService.adminLogin("email@example.com", "password")');
    return;
  }

  // STEP 2: Token formatı doğru mu?
  console.log("\n📋 STEP 2: JWT Format Kontrolü");
  const parts = token.split(".");
  console.log(`JWT parts count: ${parts.length} (should be 3)`);

  if (parts.length !== 3) {
    console.error("❌ PROBLEM: Token format geçersiz!");
    console.log("✅ ÇÖZÜM: Token'ı temizle ve yeniden login yap");
    console.log("  localStorage.removeItem('token')");
    return;
  }

  // STEP 3: Token payload'ını dekod et
  console.log("\n📋 STEP 3: Token Payload Analizi");
  try {
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

    console.log("✅ Header:", header);
    console.log("✅ Payload:", payload);

    // Check expiration
    if (payload.exp) {
      const expiresAt = new Date(payload.exp * 1000);
      const now = new Date();
      const isExpired = now > expiresAt;

      console.log(`⏰ Expires at: ${expiresAt.toLocaleString()}`);
      console.log(`⏰ Now: ${now.toLocaleString()}`);
      console.log(`⏰ Is expired: ${isExpired}`);

      if (isExpired) {
        console.error("❌ PROBLEM: Token expired!");
        console.log("✅ ÇÖZÜM: Yeniden login yap");
        localStorage.removeItem("token");
        return;
      }
    }

    // Check roles/scopes
    if (payload.role) {
      console.log(`👤 User role: ${payload.role}`);
      if (!["Admin", "admin", "ADMIN"].includes(payload.role)) {
        console.warn("⚠️ WARNING: Token'da admin role yok!");
      }
    }

    if (payload.sub) {
      console.log(`👤 User subject: ${payload.sub}`);
    }
  } catch (e) {
    console.error("❌ PROBLEM: Token payload decode edilemedi!");
    console.error("Error:", e);
    return;
  }

  // STEP 4: Authorization header doğru mu?
  console.log("\n📋 STEP 4: HTTP Request Headers Kontrolü");
  console.log("✅ Authorization header format:");
  console.log(`   Authorization: Bearer ${token.substring(0, 20)}...`);

  // STEP 5: Backend ulaşılabilir mi?
  console.log("\n📋 STEP 5: Backend Bağlantı Kontrolü");
  console.log("✅ Backend URL: https://localhost:7038");
  console.log("✅ Endpoint: /api/adminproduct");
  console.log("✅ Full URL: https://localhost:7038/api/AdminProduct");
  console.log("⚠️  HTTPS kullanıyor musunuz? Self-signed certificate?");

  // STEP 6: Network request test
  console.log("\n📋 STEP 6: Test Request Gönder");
  console.log("Aşağıdaki komutu çalıştır:");
  console.log(`
  fetch('https://localhost:7038/api/AdminProduct', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ${token}',
      'Content-Type': 'application/json',
    },
    credentials: 'include'
  })
  .then(r => r.json())
  .then(d => console.log('✅ Response:', d))
  .catch(e => console.error('❌ Error:', e))
  `);
}

export function showLoginSteps() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║              LOGIN VE TOKEN SETUP - ADIM ADIM                  ║
╚════════════════════════════════════════════════════════════════╝

ADIM 1: Login yap ve token al
─────────────────────────────
const response = await authApiService.adminLogin(
  'admin@example.com',
  'password123'
);
console.log('Token:', response.token);

ADIM 2: Token localStorage'da kayıtlı mı kontrol et
──────────────────────────────────────────────────
const token = localStorage.getItem('token');
console.log('Token stored:', !!token);

ADIM 3: Token valid mi kontrol et
──────────────────────────────────
debugTokenStorage();

ADIM 4: API çağrısı yap
──────────────────────
const products = await productApiService.getAllProducts();
console.log('Products:', products);

─────────────────────────────────────────────────────────────────
EĞER HALA 401 ALIYORSAN:
─────────────────────────────────────────────────────────────────

1️⃣  Backend'de JWT secret key değişti mi?
    → Token backend'in yeni secret'ı ile validate edemez
    → Çözüm: Yeniden login yap

2️⃣  Backend CORS configürasyonu eksik?
    → Axios requestleri block edilebilir
    → Browser console'da net::ERR_... hatası mı var?
    → Çözüm: Backend CORS settings'i kontrol et

3️⃣  Backend HTTPS sertifikası geçersiz?
    → Self-signed certificate'ı browser'a accept ettir
    → https://localhost:7038 ziyaret et, "Advanced" diyerek kabul et

4️⃣  Token role/scope yeterli mi?
    → Endpoint admin role istiyorsa, token'da admin role var mı?

5️⃣  Swagger'da çalışıyor ama Axios'ta çalışmıyor?
    → Swagger Authorization header'ını token ile mi setliyor?
    → Axios'ta Authorization header doğru eklenmiş mi?
    → debugUnauthorized() komutu çalıştır

─────────────────────────────────────────────────────────────────
QUICK FIX - Token'ı temizle ve yeniden login yap:
─────────────────────────────────────────────────────────────────
localStorage.clear();
await authApiService.adminLogin('admin@example.com', 'password123');
await productApiService.getAllProducts();

─────────────────────────────────────────────────────────────────
  `);
}

export function testAxiosInterceptor() {
  console.log("\n🧪 AXIOS INTERCEPTOR TEST");
  console.log("═".repeat(60));

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("❌ Token yok, test yapılamaz");
    console.log("Önce login yap: await authApiService.adminLogin(...)");
    return;
  }

  console.log("✅ Token bulundu");
  console.log(`✅ Token length: ${token.length}`);
  console.log(`✅ Token starts with: ${token.substring(0, 30)}...`);

  console.log("\n📝 Request Interceptor'da şu yapılmalı:");
  console.log('   config.headers.Authorization = `Bearer ${token}`');

  console.log("\n🧪 Aşağıdaki request'i yaparak interceptor'u test et:");
  console.log(`
  import { axiosInstance } from '@/lib/axios-instance';
  
  axiosInstance.get('/adminproduct')
    .then(r => console.log('✅ Success:', r.data))
    .catch(e => {
      console.error('❌ Error:', e.response?.status);
      console.error('Message:', e.response?.data);
    });
  `);
}

export function checkBackendRunning() {
  console.log("\n🔌 BACKEND RUNNING KONTROLÜ");
  console.log("═".repeat(60));

  fetch("https://localhost:7038/api/health", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((r) => {
      console.log("✅ Backend is RUNNING");
      console.log(`Status: ${r.status}`);
      return r.json();
    })
    .then((data) => console.log("Response:", data))
    .catch((e) => {
      console.error("❌ Backend is NOT RUNNING or not reachable");
      console.error("Error:", e.message);
      console.log("\nÇözümler:");
      console.log("1. Backend'i başlat: dotnet run");
      console.log(
        "2. Backend port'u kontrol et (7038 mı, yoksa farklı mı?)"
      );
      console.log("3. HTTPS sertifikası issue'su var mı?");
      console.log("4. Firewall backend'i block ediyor mu?");
    });
}

/**
 * COMPLETE DIAGNOSTIC - Tüm kontrolleri otomatik yap
 */
export async function fullDiagnostics() {
  console.clear();
  console.log("🔍 FULL 401 UNAUTHORIZED DIAGNOSTICS");
  console.log("═".repeat(70));
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log("═".repeat(70));

  // 1. Backend running?
  console.log("\n1️⃣  BACKEND RUNNING CHECK");
  await new Promise((resolve) => {
    fetch("https://localhost:7038/api/health", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        console.log("✅ Backend is running");
        resolve(true);
      })
      .catch(() => {
        console.error("❌ Backend is NOT running");
        console.log("   Çözüm: Backend'i başlat (dotnet run)");
        resolve(false);
      });
  });

  // 2. Token exists?
  console.log("\n2️⃣  TOKEN IN LOCALSTORAGE CHECK");
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("❌ Token does not exist");
    console.log("   Çözüm: Login yap");
    console.log(
      '   await authApiService.adminLogin("email@example.com", "password")'
    );
    return;
  }
  console.log("✅ Token exists");
  console.log(`   Length: ${token.length} chars`);

  // 3. Token valid?
  console.log("\n3️⃣  TOKEN VALIDITY CHECK");
  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid format");

    const payload = JSON.parse(atob(parts[1]));
    const expDate = new Date(payload.exp * 1000);
    const isExpired = new Date() > expDate;

    if (isExpired) {
      console.error("❌ Token is EXPIRED");
      console.log(`   Expired at: ${expDate.toLocaleString()}`);
      console.log("   Çözüm: Yeniden login yap");
    } else {
      console.log("✅ Token is valid");
      console.log(`   Expires at: ${expDate.toLocaleString()}`);
    }

    console.log(`   Role: ${payload.role || "N/A"}`);
    console.log(`   Subject: ${payload.sub || "N/A"}`);
  } catch (e) {
    console.error("❌ Token decode error:", e);
  }

  // 4. Test request
  console.log("\n4️⃣  TEST REQUEST");
  try {
    const response = await fetch("https://localhost:7038/api/AdminProduct", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log(`   Status: ${response.status}`);

    if (response.ok) {
      console.log("✅ Request successful!");
      const data = await response.json();
      console.log(`   Response: ${JSON.stringify(data).substring(0, 100)}...`);
    } else {
      console.error(`❌ Request failed with ${response.status}`);
      const error = await response.json();
      console.log("   Error:", error);

      if (response.status === 401) {
        console.log("\n   POSSIBLE CAUSES:");
        console.log("   • Token expired");
        console.log("   • Backend JWT secret changed");
        console.log("   • User role is insufficient");
        console.log("   • Token format is invalid");
      }
    }
  } catch (e) {
    console.error("❌ Network error:", e);
  }
}

// Export all for easy access
export const debugTools = {
  unauthorizedDebug: debugUnauthorized,
  showSteps: showLoginSteps,
  testInterceptor: testAxiosInterceptor,
  checkBackend: checkBackendRunning,
  fullDiagnostics: fullDiagnostics,
};
