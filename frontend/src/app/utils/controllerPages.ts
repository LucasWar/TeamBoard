interface IsPage {
  page: number;
}

export function createPageHandler<T extends IsPage>(
  setFilter: React.Dispatch<React.SetStateAction<T>>
) {
  return (page: number) => {
    setFilter(obj => ({
      ...obj,
      page,
    }));
  };
}