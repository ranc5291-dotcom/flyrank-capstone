import { useCollectionsContext } from '../providers/CollectionsProvider'

export default function useCollections() {
  return useCollectionsContext()
}