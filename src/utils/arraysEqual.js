function isArrayStringsEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  console.log("!", arr1);
  console.log("2", arr2);
  for (let index = 0; index < arr1.length; index++) {
    if (arr1[index] !== arr2[index]) {
      console.log(
        "COMAPRE",
        arr1[index] !== arr2[index],
        arr1[index],
        arr2[index]
      );
      return false;
    }
  }
  return true;
}

export default isArrayStringsEqual;
