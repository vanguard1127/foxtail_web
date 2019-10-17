export default ({ cache, query }) => {
  // Loop through all the data in our cache
  // And delete any items that contain the query name
  // This empties the cache of all of our list items and
  // forces a refetch of the data.
  Object.keys(cache.data.data).forEach(key => {
    if (key === "ROOT_QUERY") {
      Object.keys(cache.data.data[key]).forEach(subkey => {
        return subkey.match(query) && delete cache.data.data[key][subkey];
      });
    } else {
      return key.match(query) && cache.data.delete(key);
    }
  });
};
