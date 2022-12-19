export const calculatePageOffset = (page = 1, pageSize = 10) => {
  return (page - 1) * pageSize;
};
