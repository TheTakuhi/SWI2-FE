export const getByKey = (name) => {
    const value = localStorage.getItem(name);
    return value || undefined;
}

export const removeByKey = (name) => localStorage.removeItem(name);

export const setByKey = (name, value) => localStorage.setItem(name, value);

const ls = { getByKey, removeByKey, setByKey }

export default ls;