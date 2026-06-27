import { useMyKips } from "../../../../../app/hooks/useMyKips";

export function useIndicatorController(){
  const { data: mykips, isFetching:isFetchingMykips } = useMyKips()

  return {
    mykips,
    isFetchingMykips
  }
}