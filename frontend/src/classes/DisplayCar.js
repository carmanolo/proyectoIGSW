
const DEFAULT_ID = 0;
const DEFAULT_PATENTE = "CR-7C-R7";
const DEFAULT_CAR = `${DEFAULT_ID}. ${DEFAULT_PATENTE}`;

const findCar = (carList, id) => {
    // console.log("Carlist: ", carList);
    // console.log("id: ", id);
    if (!Array.isArray(carList)) {
        return DEFAULT_CAR;
    }

    const foundCar = carList.find((c) => {
        try {
            if (typeof(c) !== "string") {
                console.error("Auto desconocido: ", String(t));
                return false;
            }
            const newID = c.split(". ")[0];
            return Number(newID.trim()) === Number(id);
        } catch (error) {
            console.error(error);
            return false;
        }
    }) || DEFAULT_CAR;
    return String(foundCar);
}

export class DisplayCar {
    constructor(carList = [], id = 0) {
        try {
            const foundCar = findCar(carList, id);
            // console.log("FoundCar = ", foundCar);

            this._id = Number(foundCar.split(". ")[0].trim());
            this._patente = foundCar.split(". ")[1].trim();
        } catch (error) {
            console.error(error);
            this._id = DEFAULT_ID;
            this._patente = DEFAULT_PATENTE;
        }
    }

    get id() {
        return Number(this._id || DEFAULT_ID);
    }    
    set id(id) {
        this._id = Number(id);
    }

    get patente() {
        return String(this._patente || DEFAULT_PATENTE);
    }
    set patente(patente) {
        this._patente = String(patente || DEFAULT_PATENTE);
    }
}

export default DisplayCar;