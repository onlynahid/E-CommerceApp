'use client'

import { CheckCircle2, Package, Truck, Home } from 'lucide-react'

interface OrderSuccessProps {
  orderId: number
  orderDate: string
  totalAmount: number
}

export function OrderSuccess({ orderId, orderDate, totalAmount }: OrderSuccessProps) {
  const steps = [
    { icon: CheckCircle2, label: 'Sifariş\nQəbul', active: true },
    { icon: Package, label: 'Hazırlanır', active: false },
    { icon: Truck, label: 'Yolda', active: false },
    { icon: Home, label: 'Çatdırılıb', active: false },
  ]

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-400 rounded-full animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sifariş Gönderildi! ✨</h2>
          <p className="text-gray-600 text-lg">Sifarişiniz uğurla sistem üzərində qeydə alınmışdır</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-md border border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Sifariş Nömrəsi</p>
              <p className="text-2xl font-bold text-primary">#{orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Tarix</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(orderDate).toLocaleDateString('az-AZ')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Cəmi Məbləğ</p>
              <p className="text-2xl font-bold text-green-600">{totalAmount.toFixed(2)}₼</p>
            </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6 text-center">Sifarişin Həyat Dövrü</h3>
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-300 to-gray-200 transform -translate-y-1/2" />

            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((Step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                      Step.active
                        ? 'bg-green-500 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <Step.icon className="w-7 h-7" />
                  </div>
                  <p
                    className={`text-xs font-semibold text-center whitespace-pre-line ${
                      Step.active ? 'text-green-600' : 'text-gray-500'
                    }`}
                  >
                    {Step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <p className="text-blue-900 font-semibold mb-2">ℹ️ Vacib Məlumat</p>
          <p className="text-blue-800 text-sm">
            Sifarişinizin statusunu izləmək üçün səhifəni yenilə və ya hesabına daxil ol. 
            Sizə e-mail ilə bildirişlər göndəriləcəkdir.
          </p>
        </div>

        {/* What's Next */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Bundan Sonra Nə Olacaq?
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span>
              Sifarişin təsdiq edilməsini gözləyin (1-2 gün)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span>
              Məhsullar hazırlanıb göndəriləcək
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span>
              Tracking nömrəsi ilə izlə
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 font-bold">✓</span>
              Qapıda qəbul et ✨
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
