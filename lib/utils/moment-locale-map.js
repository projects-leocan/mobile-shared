export default (lang) => {
  if (lang.toLowerCase().startsWith('zh')) {
    return "zh-cn";
  }

  return lang;
}