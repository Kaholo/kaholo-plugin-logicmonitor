function parseArray(value){
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof(value) === "string") return value.split("\n").map(line=>line.trim()).filter(line=>line);
    throw "Unsupprted array format";
}

module.exports = {
    boolean : (value) =>{
        if (value === undefined || value === null || value === '') return undefined;
        return !!(value && value !=="false")
    },
    text : (value) =>{
        if (value)
            return value.split('\n');
        return undefined;
    },
    number: (value)=>{
        if (!value) return undefined;
        const parsed = parseInt(value);
        if (parsed === NaN) {
            throw `Value ${value} is not a valid number`
        }
        return parsed;
    },
    autocomplete: (value, getVal)=>{
        if (!value) return undefined;
        if (typeof(value) == "object") return (getVal ? value.value : value.id) || value;
        return value;
    },
    autocompleteOrArray: (value)=>{
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (typeof(value) == "object") return [value.id || value];
        return [value];
    },
    object: (value)=>{
        if (!value) return undefined;
        if (typeof(value) === "object") return value;
        if (typeof(value) == "string") {
            try {
                return JSON.parse(value);
            }
            catch (e) {}
            return value.split("\n").reduce((prev, cur) => {
                let [key, ...val] = cur.trim().split("=");
                if (!key || !val) throw "bad object format";
                if (Array.isArray(val)) val = val.join("=");
                prev[key] = val;
            }, {});
        }
        throw `Value ${value} is not an object`;
    },
    string: (value)=>{
        if (!value) return undefined;
        if (typeof(value) === "string") return value.trim();
        throw `Value ${value} is not a valid string`;
    },
    datetime: (value)=>{
        if (!value) return undefined;
        try{
            return Date.parse(value);
        }
        catch(e){
            throw `Value '${value}' is not a valid Date`;
        }
    },
    array: parseArray
}