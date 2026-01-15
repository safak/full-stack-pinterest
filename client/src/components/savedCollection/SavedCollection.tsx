import CollectionItem from '../collectionItem/CollectionItem'
import { items } from '../gallery/Gallery'

const SavedCollection = () => {
  return (
    <div className="w-full p-4 mx-auto py-8" >
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-5 xl:columns-6 2xl:columns-7 gap-4 space-y-4">
        {items.map((item) => (
          <CollectionItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

export default SavedCollection