import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { flattenOffers, searchParts, uniqueBrands } from '../api/favoritApi'

export const fetchBrands = createAsyncThunk(
  'parts/fetchBrands',
  async (number, { signal }) => {
    const goods = await searchParts({ number, signal })
    return { number, brands: uniqueBrands(goods) }
  }
)

export const fetchOffers = createAsyncThunk(
  'parts/fetchOffers',
  async ({ number, brand }, { signal }) => {
    const goods = await searchParts({
      number,
      brand,
      analogues: true,
      signal,
    })
    return {
      brand,
      offers: flattenOffers(goods),
    }
  }
)

const initialState = {
  number: '',
  brands: [],
  brandsStatus: 'idle',
  brandsError: null,
  selectedBrand: null,
  offers: [],
  offersStatus: 'idle',
  offersError: null,
}

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    resetSearch() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state, action) => {
        state.number = action.meta.arg
        state.brandsStatus = 'loading'
        state.brandsError = null
        state.brands = []
        state.selectedBrand = null
        state.offers = []
        state.offersStatus = 'idle'
        state.offersError = null
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brandsStatus = 'succeeded'
        state.brands = action.payload.brands
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        if (action.meta.aborted) return
        state.brandsStatus = 'failed'
        state.brandsError = action.error.message || 'Не удалось получить производителей'
      })
      .addCase(fetchOffers.pending, (state, action) => {
        state.selectedBrand = action.meta.arg.brand
        state.offersStatus = 'loading'
        state.offersError = null
        state.offers = []
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offersStatus = 'succeeded'
        state.offers = action.payload.offers
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        if (action.meta.aborted) return
        state.offersStatus = 'failed'
        state.offersError = action.error.message || 'Не удалось получить предложения'
      })
  },
})

export const { resetSearch } = partsSlice.actions
export default partsSlice.reducer
