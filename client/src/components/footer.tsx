export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 mt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm">😊</span>
              </div>
              <h4 className="text-lg font-bold text-gray-800">EmotionGIF</h4>
            </div>
            <p className="text-gray-600 text-sm">
              Duygularını paylaşmanın en eğlenceli yolu. Mükemmel GIF'i bulmanın keyfini çıkar!
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-gray-800 mb-3">Hızlı Linkler</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-purple-600 transition-colors">Hakkımızda</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">Gizlilik</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">Kullanım Şartları</a></li>
              <li><a href="#" className="hover:text-purple-600 transition-colors">İletişim</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-800 mb-3">Sosyal Medya</h5>
            <div className="flex space-x-3">
              <button className="p-2 bg-gray-100 rounded-xl hover:bg-purple-100 transition-colors">
                <span className="text-blue-400">🐦</span>
              </button>
              <button className="p-2 bg-gray-100 rounded-xl hover:bg-purple-100 transition-colors">
                <span className="text-pink-400">📷</span>
              </button>
              <button className="p-2 bg-gray-100 rounded-xl hover:bg-purple-100 transition-colors">
                <span className="text-blue-600">📘</span>
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-4 text-center text-sm text-gray-500">
          <p>© 2024 EmotionGIF. Tüm hakları saklıdır. GIPHY ile desteklenmektedir.</p>
        </div>
      </div>
    </footer>
  );
}
