export default ({ cache, query }) => {
  // Loop through all the data in our cache
  // And delete any items that contain the query name
  // This empties the cache of all of our list items and
  // forces a refetch of the data.
  Object.keys(cache.data.data).forEach(key => {
    key.match(query) && cache.data.delete(key);
  });
};
