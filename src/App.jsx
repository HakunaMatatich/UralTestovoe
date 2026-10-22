import BrandList from './components/BrandList'
import OffersTable from './components/OffersTable'
import SearchForm from './components/SearchForm'

function App() {
  return (
    <div className="app-shell">
      <header className="bg-dark text-white py-3 mb-4">
        <div className="container">
          <h1 className="h4 mb-1">Подбор автозапчастей</h1>
          <p className="mb-0 text-white-50">Поиск производителей, аналогов и предложений Favorit Parts</p>
        </div>
      </header>

      <main className="container pb-5">
        <section className="card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h5 mb-3">Этап 1. Поиск производителей</h2>
            <SearchForm />
          </div>
        </section>

        <div className="row g-4">
          <section className="col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h2 className="h5 mb-3">Производители</h2>
                <BrandList />
              </div>
            </div>
          </section>

          <section className="col-lg-8">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h2 className="h5 mb-3">Этап 2. Аналоги и предложения</h2>
                <OffersTable />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
