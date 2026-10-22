import { useSelector } from 'react-redux'
import { getOfferPrice } from '../api/favoritApi'
import ErrorAlert from './ErrorAlert'
import Loader from './Loader'

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
})

function OffersTable() {
  const { selectedBrand, offers, offersStatus, offersError } = useSelector(
    (state) => state.parts
  )

  if (!selectedBrand && offersStatus === 'idle') {
    return (
      <p className="text-secondary mb-0">
        Выберите производителя, чтобы увидеть аналоги и предложения.
      </p>
    )
  }

  if (offersStatus === 'loading') {
    return <Loader label="Загружаем аналоги и предложения…" />
  }

  if (offersStatus === 'failed') {
    return <ErrorAlert message={offersError} />
  }

  if (!offers.length) {
    return (
      <div className="alert alert-warning mb-0" role="status">
        Предложения для «{selectedBrand}» не найдены.
      </div>
    )
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle mb-0">
        <thead>
          <tr>
            <th>Название / производитель</th>
            <th>Артикул</th>
            <th>Стоимость</th>
            <th>Остаток</th>
            <th>Тип</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((item, index) => {
            const price = getOfferPrice(item)
            const stock = item.count ?? 0

            return (
              <tr key={item.goodsID || `${item.brand}-${item.number}-${index}`}>
                <td>
                  <div>{item.name || 'Без названия'}</div>
                  <div className="text-secondary small">{item.brand || '—'}</div>
                </td>
                <td>{item.number || '—'}</td>
                <td>{price == null ? '—' : priceFormatter.format(price)}</td>
                <td>{stock}</td>
                <td>
                  <span className={`badge ${item.isAnalogue ? 'text-bg-secondary' : 'text-bg-primary'}`}>
                    {item.isAnalogue ? 'Аналог' : 'Искомая'}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default OffersTable
