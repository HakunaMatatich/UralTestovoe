import { useDispatch, useSelector } from 'react-redux'
import { fetchOffers } from '../store/partsSlice'
import ErrorAlert from './ErrorAlert'
import Loader from './Loader'

function BrandList() {
  const dispatch = useDispatch()
  const { number, brands, brandsStatus, brandsError, selectedBrand, offersStatus } =
    useSelector((state) => state.parts)

  if (brandsStatus === 'idle') {
    return (
      <p className="text-secondary mb-0">
        Введите артикул, чтобы получить список производителей.
      </p>
    )
  }

  if (brandsStatus === 'loading') {
    return <Loader label="Ищем производителей…" />
  }

  if (brandsStatus === 'failed') {
    return <ErrorAlert message={brandsError} />
  }

  if (!brands.length) {
    return (
      <div className="alert alert-warning mb-0" role="status">
        По артикулу «{number}» производители не найдены.
      </div>
    )
  }

  return (
    <div className="list-group">
      {brands.map((item) => {
        const isActive = item.brand === selectedBrand
        const isLoading = isActive && offersStatus === 'loading'

        return (
          <button
            key={item.brand}
            type="button"
            className={`list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
            onClick={() => dispatch(fetchOffers({ number, brand: item.brand }))}
            disabled={offersStatus === 'loading'}
          >
            <div className="d-flex justify-content-between gap-3">
              <strong>{item.brand}</strong>
              {isLoading ? (
                <span className="spinner-border spinner-border-sm" aria-hidden="true" />
              ) : (
                <span className={isActive ? '' : 'text-secondary'}>
                  ост. {item.count}
                </span>
              )}
            </div>
            {item.name ? (
              <div className={`small ${isActive ? '' : 'text-secondary'}`}>{item.name}</div>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export default BrandList
