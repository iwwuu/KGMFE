export function isDocumentReady(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

export function findIndex(name, array) {
    for (let index = 0; index < array.length; index++) {
        if (!array[index].localeCompare(name))
            return index;
    }
    return -1;
}