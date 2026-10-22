import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBrands } from '../store/partsSlice'

function SearchForm() {
  const dispatch = useDispatch()
  const brandsStatus = useSelector((state) => state.parts.brandsStatus)
  const currentNumber = useSelector((state) => state.parts.number)
  const [number, setNumber] = useState(currentNumber)

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = number.trim()
    if (!trimmed) return
    dispatch(fetchBrands(trimmed))
  }

  return (
    <form className="row g-2 align-items-end" onSubmit={handleSubmit}>
      <div className="col-md-8">
        <label htmlFor="article" className="form-label">
          Артикул детали
        </label>
        <input
          id="article"
          className="form-control"
          type="text"
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          placeholder="Например, 01089"
          autoComplete="off"
        />
      </div>
      <div className="col-md-4">
        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={!number.trim() || brandsStatus === 'loading'}
        >
          Найти производителей
        </button>
      </div>
    </form>
  )
}

export default SearchForm
