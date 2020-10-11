const filterQuery = (filters) => {
  let formatedFilter = {};
  Object.entries(filters).forEach((filter) => {
    let key = 'data.' + filter[0];
    let value = { $regex: `${filter[1]}`, $options: 'i' };
    formatedFilter[key] = value;
  });
  return formatedFilter;
};

export default filterQuery;
