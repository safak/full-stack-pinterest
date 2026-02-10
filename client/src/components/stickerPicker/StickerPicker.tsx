import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

const API_KEY = import.meta.env.VITE_GIPHY_SDK_KEY

const gf = new GiphyFetch(API_KEY)

const StickerPicker = ({ onSelect, type, setType }: { onSelect: (gif: any) => void, type?: string, setType: (type: string) => void }) => {
  const [query, setQuery] = useState<string>(type ?? "")

  useEffect(() => {
    setQuery(type ?? "")
  }, [type])

  // debounce updating parent `type` to avoid too many requests while typing
  useEffect(() => {
    const id = setTimeout(() => setType(query), 300)
    return () => clearTimeout(id)
  }, [query, setType])

  const fetchFn = (offset: number) => {
    let q = query.trim() || 'funny'
    return gf.search(q, { offset, limit: 6, type: 'stickers' })
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex border-2 rounded-lg justify-between items-center px-2 mb-2 w-full'>
        <Input
          value={query}
          placeholder="Search stickers"
          className="text-lg! font-medium"
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search />
      </div>

      <Grid
        hideAttribution={true}
        width={320}
        className='max-h-90 cursor-pointer'
        columns={3}
        noLink={true} // disable giphy's default behavior of linking to their site on click
        // close the picker on selection
        fetchGifs={fetchFn}
        onGifClick={(gif, e) => {
          e.preventDefault()
          onSelect(gif)
        }}
        gutter={6}
      />
    </div>
  )
}

export default StickerPicker
