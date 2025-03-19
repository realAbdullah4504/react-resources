export const validation = (value, errorMessage, formSetting) => {
  //console.log("formSetting", formSetting);
  // console.log("value", value);


  for (const key in value) {
    const obj = formSetting.find((data) => data.name === key);
    //console.log("obj", obj);
    console.log(key);
    if (obj?.required) {
      // if (value.hasOwnProperty(key) && value[key].trim() === "") 
      return false;
    }
  }
  for (const key in errorMessage) {
    const obj = formSetting.find((data) => data.name === key);
    //console.log("obj", obj);
    if (obj?.required) {
      if (errorMessage.hasOwnProperty(key) && errorMessage[key].trim() !== "")
        return false;
    }
  }
  return true;
};

