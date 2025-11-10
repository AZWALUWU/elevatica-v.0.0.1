import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, TrendingUp, Shield, BarChart3, Check, Bell } from 'lucide-react';
import NavigationPanel from '@/components/NavigationPanel';
import { useAuth } from '@/contexts/AuthContext';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const HomeInstalled = () => {
  const { user } = useAuth();
  const { isSupported, permission, requestPermission } = usePushNotifications();

  return (
    <div className="min-h-screen bg-background">
      <NavigationPanel />
      
      {/* Main Content - Add padding for navigation panels */}
      <div className="md:pl-20 pb-16 md:pb-0">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-overlay opacity-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Elevatica Tingkatkan</span>
              <br />
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                Analisa Market
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto px-4">
              Sebuah platform berbasis riset untuk analisis pasar dan wawasan investasi.
              Memberdayakan pengambilan keputusan melalui ketepatan statistik, fundamental, dan ketelitian teknikal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              {user ? (
                <>
                  <Link to="/research" className="w-full sm:w-auto">
                    <Button size="lg" className="bg-gradient-gold text-black hover:shadow-gold-lg font-semibold text-base md:text-lg px-6 md:px-8 w-full sm:w-auto">
                      Explore Research
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  {isSupported && permission !== 'granted' && (
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-gold text-gold hover:bg-gold hover:text-black text-base md:text-lg px-6 md:px-8 w-full sm:w-auto"
                      onClick={requestPermission}
                    >
                      <Bell className="mr-2 w-5 h-5" />
                      Aktifkan Notifikasi
                    </Button>
                  )}
                  {permission === 'granted' && (
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-green-500 text-green-500 cursor-default text-base md:text-lg px-6 md:px-8 w-full sm:w-auto"
                      disabled
                    >
                      <Bell className="mr-2 w-5 h-5" />
                      Notifikasi Aktif
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Link to="/research" className="w-full sm:w-auto">
                    <Button size="lg" className="bg-gradient-gold text-black hover:shadow-gold-lg font-semibold text-base md:text-lg px-6 md:px-8 w-full sm:w-auto">
                      Explore Research
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/auth" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black text-base md:text-lg px-6 md:px-8 w-full sm:w-auto">
                      Login to Access
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-gold rounded-lg mx-auto mb-4 flex items-center justify-center shadow-gold">
                <TrendingUp className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">Analisa Mendalam</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Analisa yang mendalam menggunakan fundamental, indikator, dan juga teknikal.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-gold rounded-lg mx-auto mb-4 flex items-center justify-center shadow-gold">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">Riset & Bantuan</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Riset dan Komunitas hanya terbuka bagi user yang telah mendaftar.
              </p>
            </div>

            <div className="text-center p-6 sm:col-span-2 md:col-span-1">
              <div className="w-16 h-16 bg-gradient-gold rounded-lg mx-auto mb-4 flex items-center justify-center shadow-gold">
                <BarChart3 className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 text-foreground">Keterbukaan Hasil</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Jurnal trading yang dipublikasikan berdasarkan riset market yang di keluarkan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                Informasi Harga
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Saat ini semua fitur dapat diakses secara gratis selama masa testing.
            </p>
          </div>

          <Card className="bg-secondary/30 border-gold/20">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl md:text-3xl font-bold mb-2">
                Masa Testing Gratis
              </CardTitle>
              <CardDescription className="text-base md:text-lg">
                Akses penuh ke semua fitur Elevatica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Analisa mendalam dengan fundamental, indikator, dan teknikal</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Akses ke riset dan komunitas eksklusif</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Jurnal trading berdasarkan riset market</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-gold mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Notifikasi real-time untuk update riset terbaru</span>
                </li>
              </ul>
              <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Catatan:</strong> Setelah masa testing berakhir, semua fitur akan berbayar. 
                  Informasi harga akan diumumkan sebelum masa testing berakhir.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-gold bg-clip-text text-transparent">
                Bergabung dengan Komunitas
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Ikuti kami untuk update terbaru, tips trading, dan diskusi dengan komunitas Elevatica.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-secondary/30 border-gold/20 hover:border-gold/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-[#5865F2] rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </div>
                <CardTitle className="text-center text-xl">Discord</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Bergabung dengan server Discord kami untuk diskusi real-time dan support dari komunitas.
                </p>
                <a 
                  href="https://discord.gg/elevatica" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block w-full"
                >
                  <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white w-full">
                    Join Discord
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="bg-secondary/30 border-gold/20 hover:border-gold/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#FD1D1D] rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </div>
                <CardTitle className="text-center text-xl">Instagram</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Follow Instagram kami untuk tips trading, update market, dan konten visual menarik.
                </p>
                <a 
                  href="https://instagram.com/elevatica" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block w-full"
                >
                  <Button className="bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#FD1D1D] hover:opacity-90 text-white w-full">
                    Follow Instagram
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="text-sm">
            © 2025 Elevatica. Empowering Market Research.
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default HomeInstalled;
