let history;
const registerNav = (ref) => {
  if (ref && ref.history) {
    history = ref.history;
  }
};

const jumpTo = (uri) => {
  history.push(uri);
};

const replace = (uri) => {
  history.replace(uri);
};
const go = (uri) => {
  console.log(uri);
  history.go(uri);
};
export { jumpTo, replace, go, registerNav };
